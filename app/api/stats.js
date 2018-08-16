import dgram from "dgram"
import bunyan from "bunyan"

class Graphite {
  constructor() {
    this.apiKey = process.env.HOSTEDGRAPHITE_APIKEY

    this.logger = bunyan.createLogger({
      name: "Stats",
      serializers: {
        err: bunyan.stdSerializers.err
      }
    })

    if (process.env.NODE_ENV === "test") {
      this.logger.level("error")
    }

    if (this.apiKey) {
      this.socket = dgram.createSocket("udp4")
    }
    else {
      this.logger.info("No configuration found, stats will only be sent to logs.")
    }
  }

  send(name, value) {
    this.logger.info(`${name}: ${value}`)

    if (this.socket) {
      this.socket.send(`${this.apiKey}.${name} ${value}\n`, 2003, "carbon.hostedgraphite.com", (err) => {
        if (err) {
          this.logger.error({err})
        }
      })
    }
  }

  async time(name, fn) {
    const startedAt = Date.now()
    const result = await fn()
    this.send(name, Date.now() - startedAt)
    return result
  }
}

export default global.__stats || (global.__stats = new Graphite())
