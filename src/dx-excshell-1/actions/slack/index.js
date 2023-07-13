/**
 * Demonstrating how to write an event handler for webhook calls
 *
 * This action is expose as a web action, you can use its URL to register as a webhook for I/O Events
 */
const { Core } = require('@adobe/aio-sdk')
const fetch = require('node-fetch')
const { errorResponse, stringParameters, checkMissingRequestInputs } = require('../utils')

// Set up an Incoming Webhooks for your team: https://api.slack.com/incoming-webhooks
// Then update the following variables with your slack config values
const slackWebhook = 'https://hooks.slack.com/services/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'
const slackChannel = 'general'

// main function that will be executed by Adobe I/O Runtime
async function main (params) {
  // create a Logger
  const logger = Core.Logger('main', { level: params.LOG_LEVEL || 'info' })

  try { 
    const slackMessage = "Hello!"
      
    const payload = {
      channel: slackChannel,
      username: 'incoming-webhook',
      text: slackMessage,
      mrkdwn: true
    }
      
    var slackOpts = {
      method: 'POST',
      headers: {
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    }

    await fetch(slackWebhook, slackOpts)

    const response = {
      statusCode: 200,
      body: { message: 'posted to slack' }
    }

    // log the response status code
    logger.info(`${response.statusCode}: successful request`)
    return response
  } catch (error) {
    // log any server errors
    logger.error(error)
    // return with 500
    return errorResponse(500, 'server error', logger)
  }
}

exports.main = main
