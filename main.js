const core = require("@actions/core");
const github = require('@actions/github');


async function main() {
    try {

        // Get the JSON webhook payload for the event that triggered the workflow
        const payload = JSON.stringify(github.context.payload, undefined, 2)
        console.log('payload is ', payload)


        const mjPublic = core.getInput("mailjet_public", { required: true })
        const mjPrivate = core.getInput("mailjet_private", { required: true })
        const fromEmail = core.getInput("from_email", { required: true })
        const fromName = core.getInput("from_name", { required: true })
        

        const mailjet = require ('node-mailjet').connect(mjPublic, mjPrivate)
        const mjRequest = mailjet.post("send", {'version': 'v3.1'})
        let emailData = {
            "Messages": [
                {
                    "From": {
                        "Email": fromEmail,
                        "Name": fromName
                    },
                    "To": "chris@siliconflight.com",
                    'Subject': "Test From action!",
                    "TextPart": "This is the test content from the action:" + payload
                }
            ]
        }
        console.log('sending email now...')
        try {
            await mjRequest.request(emailData)
            console.log('email sent OK')
        } catch(err) {
            // can't do anything about it, tough
            console.log('error sending email', emailData, err)
        }
        console.log(info)
    } catch (error) {
        core.setFailed(error.message)
    }
}

main()