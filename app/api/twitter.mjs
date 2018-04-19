import url from "url"
import crypto from "crypto"
import fetch from "node-fetch"
import strictUriEncode from "strict-uri-encode"

import Tweet from "../models/tweet"

const URLSearchParams = url.URLSearchParams

export default class Twitter {
  constructor({consumer_key, consumer_secret, access_token, access_token_secret}) {
    this.consumer_key = consumer_key
    this.consumer_secret = consumer_secret
    this.access_token = access_token
    this.access_token_secret = access_token_secret
  }

  get isConfigured() {
    return !!(this.consumer_key && this.consumer_secret && this.access_token && this.access_token_secret)
  }

  async getBearerToken() {
    if (this.bearerToken) {
      return this.bearerToken
    }

    const authorization = Buffer.from(
      [this.consumer_key, this.consumer_secret].map(encodeURIComponent).join(":")
    ).toString("base64")

    const response = await fetch("https://api.twitter.com/oauth2/token", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${authorization}`,
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
      },
      body: new URLSearchParams({ grant_type: "client_credentials" })
    })

    const body = await response.json()

    return this.bearerToken = body.access_token
  }

  async search(params) {
    const token = await this.getBearerToken()

    const qs = new URLSearchParams(Object.assign({
      result_type: "recent",
      tweet_mode: "extended",
      count: 15
    }, params))

    const response = await fetch(`https://api.twitter.com/1.1/search/tweets.json?${qs}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })

    const body = await response.json()

    return body.statuses.map((attributes) => new Tweet(attributes))
  }

  async tweet(tweet) {
    const method = "POST"
    const url = "https://api.twitter.com/1.1/statuses/update.json"
    const authorization = this.generateUserAuthorization(method, url, tweet)

    return fetch(url, {
      method,
      headers: {
        "Authorization": `OAuth ${authorization}`,
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
      },
      body: new URLSearchParams(tweet)
    })
  }

  generateUserAuthorization(method, url, params) {
    const auth = {
      oauth_consumer_key: this.consumer_key,
      oauth_nonce: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
      oauth_signature_method: "HMAC-SHA1",
      oauth_timestamp: Math.round(new Date().getTime() / 1000),
      oauth_token: this.access_token,
      oauth_version: "1.0"
    }

    const signatureParams = new URLSearchParams(Object.assign({}, auth, params))
    signatureParams.sort()

    const signatureParamsString = Array.from(signatureParams)
      .map((pair) => pair.map(strictUriEncode).join("=")).join("&")

    const signatureString = [method, url, signatureParamsString].map(strictUriEncode).join("&")
    const signingKey = [this.consumer_secret, this.access_token_secret].map(strictUriEncode).join("&")
    const signature = crypto.createHmac("sha1", signingKey).update(signatureString).digest("base64")

    auth.oauth_signature = signature

    return Object.keys(auth).map((key) => {
      return [strictUriEncode(key), `"${strictUriEncode(auth[key])}"`].join("=")
    }).join(", ")
  }
}
