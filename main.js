const core = require("@actions/core");
const github = require('@actions/github');
const fs = require("fs");


function execShellCommand(cmd) {
    const exec = require('child_process').exec;
    return new Promise((resolve, reject) => {
     exec(cmd, (error, stdout, stderr) => {
      if (error) {
       console.warn(error);
      }
      resolve(stdout? stdout : stderr);
     });
    });
}


async function main() {
    try {

        // Get the JSON webhook payload for the event that triggered the workflow
        const payload = JSON.stringify(github.context.payload, undefined, 2)
        // console.log('payload is ', payload)



        console.dir(process.env)
        console.dir(JSON.parse(payload), {depth: null})


        // const latestCommitMessage = core.getInput("commit_message")
        // console.log('latest commit message is ' + latestCommitMessage)

        // const semverRegex = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;
        const appCommitString = (await execShellCommand('git log -1 --format=%s')).trim()
        console.log('appCommitString is ' + appCommitString + '/' + github.event.head_commit.message)

        console.dir(github.event, {depth: null})
        
        
        

        
/*

        const pathToPackageJson = core.getInput("path_to_package_json")
        const mjPublic = core.getInput("mailjet_public", { required: true })
        const mjPrivate = core.getInput("mailjet_private", { required: true })
        // const fromEmail = core.getInput("from_email", { required: true })
        // const fromName = core.getInput("from_name", { required: true })
        // const sendTo = core.getInput("send_to", { required: true })
        // const sendToJson = JSON.parse(sendTo)
        // console.log(`fromEmail is ${fromEmail} and fromName is ${fromName}`)
        


        const deployState = 'failure';  //! TEST
        const deployedVersion = '1.x.x';


        const emailRegex = /(?:"?([^"]*)"?\s)?(?:<?(.+@[^>]+)>?)/;

        // get package.json of the calling repo, to get the description of the project
        const filePackageDotJson = JSON.parse(fs.readFileSync(pathToPackageJson, "utf8"))

        // extract email_on_deploy: from, success & failure arrays
        const eodParams = filePackageDotJson.email_on_deploy
        const [rest, fromName, fromEmail] = emailRegex.exec(eodParams.from)

        //



        const mailjet = require ('node-mailjet').connect(mjPublic, mjPrivate)
        const mjRequest = mailjet.post("send", {'version': 'v3.1'})
        let emailData = {
            "Messages": [
                {
                    "From": {
                        "Email": fromEmail,
                        "Name": fromName
                    },
                    "To": eodParams[deployState].map(e => {
                        const emailSplit = emailRegex.exec(e)
                        return {
                            "Email": emailSplit[2],
                            "Name": emailSplit[1]
                        }
                    }),
                    'Subject': deployState == 'success' ? `New Version of ${filePackageDotJson.description} [v${deployedVersion}] now live` : `FAILED deployment for ${filePackageDotJson.description} ${deployedVersion}`,
                    "TextPart": deployState == 'success' ? `
                        Version ${deployedVersion} of ${filePackageDotJson.description} has been successfully deployed at XXXX and is now live to use.
                    ` : `
                        FAILED to deploy version ${deployedVersion} of ${filePackageDotJson.description}.  Check for errors in build log.  Previously deployed version remains the current live version.
                    `,
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

*/


    } catch (error) {
        core.setFailed(error.message)
    }
}

main()


// to delete tag by command line:
// git push --delete origin v1