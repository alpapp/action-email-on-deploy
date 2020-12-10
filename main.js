const core = require("@actions/core");
const github = require('@actions/github');
const fs = require("fs");


async function main() {
    try {

        // Get the JSON webhook payload for the event that triggered the workflow
        const payload = JSON.stringify(github.context.payload, undefined, 2)
        console.log('payload is ', payload)



        const pathToPackageJson = core.getInput("path_to_package_json")
        const mjPublic = core.getInput("mailjet_public", { required: true })
        const mjPrivate = core.getInput("mailjet_private", { required: true })
        const fromEmail = core.getInput("from_email", { required: true })
        const fromName = core.getInput("from_name", { required: true })

        const sendTo = core.getInput("send_to", { required: true })
        const sendToJson = JSON.parse(sendTo)

        console.log(`fromEmail is ${fromEmail} and fromName is ${fromName}`)
        


        const deployState = 'failure';  //! TEST



        // get package.json of the calling repo, to get the description of the project
        const filePackageDotJson = fs.readFileSync(pathToPackageJson, "utf8")



        const mailjet = require ('node-mailjet').connect(mjPublic, mjPrivate)
        const mjRequest = mailjet.post("send", {'version': 'v3.1'})
        let emailData = {
            "Messages": [
                {
                    "From": {
                        "Email": fromEmail,
                        "Name": fromName
                    },
                    "To": sendToJson[deployState].map(e => ({"Email": e})),
                    'Subject': "Test From action!",
                    "TextPart": "This is the test content from the action:" + filePackageDotJson
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
            console.dir(emailData, {depth: null})
        }

    } catch (error) {
        core.setFailed(error.message)
    }
}

main()


// to delete tag by command line:
// git push --delete origin v1