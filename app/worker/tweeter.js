import bunyan from "bunyan"
import Twitter from "../api/twitter"
import DC311 from "../api/dc311"

export default class Tweeter {
  constructor() {
    this.twitter = new Twitter({
      consumer_key: process.env.TWITTER_CONSUMER_KEY,
      consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
      access_token: process.env.TWITTER_ACCESS_TOKEN,
      access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
    })

    this.logger = bunyan.createLogger({
      name: "Twitter Worker",
      serializers: {
        err: bunyan.stdSerializers.err,
        response: (response) => {
          return {
            url: response.url,
            status: response.status,
            headers: Array.from(response.headers).reduce((headers, pair) => {
              headers[pair[0]] = pair[1]
              return headers
            }, {})
          }
        }
      }
    })

    if (this.twitter.isConfigured) {
      this.processTweets()
    }
    else {
      this.logger.info("No configuration found, tweets will not be processed.")
    }
  }

  async processTweets() {
    this.logger.info("Fetching and processing new 311 tweets from Twitter.")

    const oneHourAgo = new Date()
    oneHourAgo.setHours(oneHourAgo.getHours() - 1)

    let tweetsFrom311
    let tweetsFromMe

    try {
      tweetsFrom311 = await this.twitter.search({ q: "from:311dcgov", count: 15 })
      tweetsFromMe = await this.twitter.userTimeline("dc311rn")
    }
    catch (err) {
      this.logger.warn({ err }, "Unable to fetch tweets from Twitter.")
      this.scheduleNext()
      return
    }

    await Promise.all(tweetsFrom311.filter((t) => t.hasServiceRequestNumber).filter((tweet) => {
      if (tweetsFromMe.find((t) => t.inReplyToTweet === tweet.id)) {
        this.logger.info({ tweet }, "Already tweeted a reply to this tweet.")
        return false
      }
      else if (tweet.createdAt < oneHourAgo) {
        this.logger.info({ tweet }, "Skipping reply to tweet earlier than one hour before boot time (service was offline).")
        return false
      }
      else {
        return true
      }
    }).map((tweet) => this.verifyAndReplyTo(tweet)))

    this.scheduleNext()
  }

  async verifyAndReplyTo(tweet) {
    let serviceRequests

    try {
      serviceRequests = await Promise.all(tweet.serviceRequestNumbers.map((sr) => {
        return DC311.getServiceRequest(sr)
      }))
    }
    catch (err) {
      this.logger.warn({ err, tweet }, "Could not fetch service requests from 311 for tweet.")
      return
    }

    return this.replyTo(tweet, serviceRequests)
  }

  async replyTo(tweet, serviceRequests) {
    const urls = serviceRequests.map((sr) => `https://www.dc311rn.com/${sr.number} (${sr.type})`)
    const text = `Status${urls.length > 1 ? "es" : ""}: ${urls.join(", ")} ✨`

    const response = await this.twitter.tweet({
      status: text,
      in_reply_to_status_id: tweet.id,
      auto_populate_reply_metadata: true,
      lat: serviceRequests[0].latitude,
      long: serviceRequests[0].longitude,
      display_coordinates: true,
      exclude_reply_user_ids: [
        633993114, // @DCDHCD
        18768730, // @DC_HSEMA
        22509067, // @dcdmv
        745716766643523585, // @OUC_DC
        2964352984, // @DCMOCA
        86340250, // @DCDPW
        21789369, // @DDOTDC
        301494181 // @DC_Housing
      ].join()
    })

    if (!response.ok) {
      const body = await response.json()
      this.logger.warn({ response, body }, "Unable to post tweet reply.")
    }
  }

  scheduleNext() {
    const delay = 60

    this.logger.info(`Batch process completed; scheduling next execution in ${delay} seconds.`)
    setTimeout((() => this.processTweets()), delay * 1000)
  }
}
