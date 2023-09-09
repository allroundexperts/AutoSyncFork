import {App} from "octokit";

const app = new App({
    appId: process.env["APP_ID"] || "",
    privateKey: `${process.env["PRIVATE_KEY"] || ""}`.replace(/\\n/g, '\n'),
});

(async () => {
    await app.eachRepository(async ({octokit, repository}) => {
        if (!repository.fork) {
            console.log(`Repository ${repository.owner.login}/${repository.name} is not a fork`);
            return;
        }
        console.log(`Trying to merge upstream branch ${repository.default_branch}: `, `/repos/${repository.owner.login}/${repository.name}/merge-upstream`);
        const response = await octokit.request('POST /repos/{owner}/{repo}/merge-upstream', {
            owner: repository.owner.login, 
            repo: repository.name,
            branch: repository.default_branch
        });
        console.log('Result: ', response.status, response.data.message);

        /*
        if (response.data.merge_type !== "none") {
            await octokit.request('POST /repos/{owner}/{repo}/git/commits', {
                owner: repository.owner.login, 
                repo: repository.name,
                branch: 'main',
                committer: {
                    name: 'Auto Sync Fork Bot',
                },
                message: '',  
                tree:   
            })
        }
        */
    });
})();