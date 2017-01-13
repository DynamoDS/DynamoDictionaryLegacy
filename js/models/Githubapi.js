function githubSubmitter(token,files, mainExampleFile, branchName, message, terminate) {
    axios.get('./configuration/config.json').then((resolve, reject) => {
        const token = resolve.data.GitHub_Token;
        runSubmit(token,files, mainExampleFile, branchName, message, terminate)
    })
}
function dynContents(f) {
    console.log('dyn run',f)
    var file_path = 'public/' + f.og.slice(2).replace("Examples", "EXAMPLES");
    var fileOb = {
        content: f.data,
        isBase64: false
    };
    return [file_path, fileOb];
}

function imageContents(f) {
    console.log('img run',f)
    var file_path = 'public/' + f.og.slice(2).replace("Examples", "EXAMPLES");
    var file_contents = window.atob((f.data.replace(/^(.+,)/, '')));
    var fileOb = {
        content: file_contents,
        isBase64: true
    };
    return [file_path, fileOb];
}
function runSubmit(token,files, mainExampleFile, branchName, message, terminate) {
    var branchExists = false;
    files.push(mainExampleFile)
    var gh = new Octokit({
        token: token
    });
    var repo = gh.getRepo('DynamoDS', 'DynamoDictionary');
    repo.getBranches()
        .then(function(branches) {
            if (branches.filter(function(b) {
                    return b[2] === branchName;
                }).length > 0) {
                console.log('branchExists')
                branchExists = true;
                commitFiles(repo.getBranch(branchName));
            } else {
                console.log('branch does not exist')
                var branch = repo.getBranch();
                branch.createBranch(branchName)
                    .then(function(b) {
                        commitFiles(repo.getBranch(branchName))
                    })
            }
        })
    function commitFiles(branch) {
        if (files.length > 0) {
            var contents = {};
            files.forEach(function(f) {
                switch (f.type) {
                    case 'image':
                        var ob = imageContents(f);
                        contents[ob[0]] = ob[1];
                        break;
                    case 'xml':
                        var ob = dynContents(f);
                        contents[ob[0]] = ob[1];
                        break;
                    default:
                        contents['public/data/Dynamo_Nodes_Documentation.json'] = JSON.stringify(f, null, 4);
                        return undefined;
                }
            })
            console.log(contents,message);
            branch.writeMany(contents, message)
                .then(function() {
                    if (!branchExists) {
                        return repo.createPullRequest({
                            "title": branchName,
                            "body": "files updated by user",
                            "head": branchName,
                            "base": "master"
                        })
                    } else {
                        return axios.get('https://api.github.com/repos/DynamoDS/DynamoDictionary/pulls')
                    }
                })
                .then(function(result) {
                  if(result.html_url){
                    terminate(result.html_url);
                  }
                  else{
                    result.data.forEach((d,i)=>{
                      if(d.head.ref===branchName){
                        terminate(d.html_url)
                      }
                    })
                  }
                })
        }
    }
}
