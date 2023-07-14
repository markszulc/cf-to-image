/**
 * Demonstrating how to write an event handler for webhook calls
 *
 * This action is expose as a web action, you can use its URL to register as a webhook for I/O Events
 */
const { Core } = require('@adobe/aio-sdk')
const fetch = require('node-fetch')
const { errorResponse, stringParameters, checkMissingRequestInputs } = require('../utils')

// main function that will be executed by Adobe I/O Runtime
async function main (params) {
  // create a Logger
  const logger = Core.Logger('main', { level: params.LOG_LEVEL || 'info' })
  logger.info(`CF Event Fired`)

  // Set up an Incoming Webhooks for your team: https://api.slack.com/incoming-webhooks
  // Then update the following variables with your slack config values
  const slackWebhook = params.SLACK_WEBHOOK_URL
  const slackChannel = params.SLACK_CHANNEL

  const cfpath = params.data.path;
  const cftype = params.type;
  const cfmodelid = String(params.data.model.id)
  const cfmodel = cfmodelid.substring(cfmodelid.lastIndexOf('/') + 1);
  const cfname = String(params.data.path).substring(cfpath.lastIndexOf('/') + 1);
  let cfpreviewurl = "https://experience.adobe.com/#/@mark-szulc/custom-apps/20092-cfpreview?cf=" + cfpath + "&variation=main";

  let cfaction = "Unknown";

  switch(cftype) {
    case 'aem.sites.contentFragment.modified':
      cfaction = "Modified";
      break
    case 'aem.sites.contentFragment.created':
      cfaction = "Created";
      break
    }


    
  try { 
    const slackMessage = "Content Fragment " + cfname + " " + cfaction + " <" + cfpreviewurl + "|Preview>";
      
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

    const foo = await fetch(slackWebhook, slackOpts)


    const response = {
      statusCode: foo.status,
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
