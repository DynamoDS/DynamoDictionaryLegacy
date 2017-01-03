// import './css/style.css';

export default function(ob){
  console.log(ob);
}
// function commitChanges(ob) {
//     require("github-api", function (Github) {
//         var token;
//         $j.getJSON("./configuration/config.json", function (result) {
//             token = result["GitHub_Token"];
//             // This is a personal access token, not using oAuth.
//             // Currently this is under ramramps.  We have  to create
//             // a generic user id and add to Github collobrator.
//             // Add the token to a config file and put it in S3. Do not share the token
//             var github = new Github({
//                 token: token
//             });
//             //step 1: Create the branch
//             //TO DO : Generate unique name for the branch
//             var repo = github.getRepo("DynamoDS", "DynamoDictionary");
//             var pull;
//
//             function commitFile(data) {
//                 //currently do a commit for each file (completed in the map function below)
//                 var options = {
//                     author: {
//                         name: 'User'
//                         , email: 'user@example.com'
//                     }
//                     , committer: {
//                         name: 'User'
//                         , email: 'user@example.com'
//                     }
//                     , encode: data.enc // Whether to base64 encode the file. (default: true)
//                 };
//                 repo.writeFile(gitInfo.branchName, data.if, data.i, gitInfo.Message, options, function (err) {
//                     if (err) {
//                         console.log(err)
//                         onGHError()
//                     }
//                     else {
//                         if (prd == false) {
//                             pr();
//                             prd = true;
//                         }
//                     }
//                 });
//             }
//             repo.createBranch("master", gitInfo.branchName, function (err) {
//                 //create a branch
//                 var filelist = [];
//                 filelist[0] = {
//                         i: ob
//                         , if: 'data/Dynamo_Nodes_Documentation.json'
//                         , enc: true
//                     }
//                     //eOb represents all of the nodes that have been changed.
//                 for (key in eOb) {
//                     console.log(eOb)
//                     for (keykey in eOb[key]) {
//                         var mainOb = JSON.parse(ob);
//                         var nodeOb = mainOb[key];
//                         var subub = eOb[key][keykey]
//                         if(subub.imageFile){
//
//                         }
//
//                         console.log(subub)
//                         if (subub.image && subub.imageFile) {
//                             var imageFile = 'data/EXAMPLES/' + nodeOb.folderPath + "/img/" + subub.imageFile.split('.')[0] + ".jpg";
//                             filelist.push({
//                                 i: window.btoa(window.atob((subub.image.replace(/^(.+,)/, ''))))
//                                 , if: imageFile
//                                 , enc: false
//                             });
//                         }
//                         if (subub.dyn && subub.dynFile) {
//                             var dynFile = 'data/EXAMPLES/' + nodeOb.folderPath + "/dyn/" + subub.dynFile.split('.')[0] + ".dyn";
//                             filelist.push({
//                                 i: subub.dyn
//                                 , if: dynFile
//                                 , enc: true
//                             });
//                         }
//                     }
//                 }
//                 if (filelist.length > 0) {
//                     filelist.map(commitFile);
//                 }
//             });
//
//             function viewPR(url) {
//                 //view pull request after creation
//                 var SM = new SimpleModal({
//                     "btn_ok": "Commit Edits"
//                 });
//                 SM.options.draggable = false;
//                 SM.show({
//                     "title": '<a href="https://github.com/DynamoDS/DynamoDictionary" target=_blank><img src="images/src/icon.png" width="30" alt="dynamoIcon" align="middle" target="_blank" style="vertical-align:middle;"></a>&nbsp<span>Pull Request Created!</span>'
//                     , "contents": "Pull Request created! Thank you for your patience while we review before updating the site. <a href='" + url + "' target=_blank style='color:black;'>Follow your PR on Github here.</a>"
//                 , });
//                 //            d3.selectAll(".close").on('click',function(){location.reload()})
//                 //            d3.selectAll("#simple-modal-overlay").on('click',function(){location.reload()})
//             }
//
//             function onGHError() {
//                 //error logging
//                 var SM = new SimpleModal({
//                     "btn_ok": "Commit Edits"
//                 });
//                 SM.options.draggable = false;
//                 SM.show({
//                     "title": '<a href="https://github.com/DynamoDS/DynamoDictionary" target=_blank><img src="images/src/icon.png" width="30" alt="dynamoIcon" align="middle" target="_blank" style="vertical-align:middle;"></a>&nbsp<span>Pull Request Error</span>'
//                     , "contents": "There was an issue submitting the Pull Request to the Github repo. Visit the <a href='https://github.com/DynamoDS/DynamoDictionary' target='_blank' style='color:red;'>Dynamo Dictionary repo</a> to submit an issue or a manual pull request."
//                 , });
//             }
//
//             function pr() {
//                 //create pull request
//                 repo.getContents(gitInfo.branchName, "README.md", true, function (err, contents) {
//                     var pull = {
//                         title: gitInfo.branchName
//                         , body: "This pull request has been automatically generated by DynamoDictionaryUser."
//                         , base: "master"
//                         , head: gitInfo.branchName
//                     };
//                     repo.createPullRequest(pull, function (err, pullRequest) {
//                         if (err) {
//                             onGHError()
//                         }
//                         else {
//                             viewPR(pullRequest.html_url);
//                             submittedpr = true;
//                             d3.select('#prLogo').attr("src", "images/icons/gh.png")
//                             d3.select('#submitPR').select("span").html("View PR on Github! &nbsp;&nbsp;&nbsp;")
//                             d3.select('#submitPR').on("click", function () {
//                                 window.location = (pullRequest.html_url)
//                             })
//                         }
//                     });
//                 })
//             }
//         });
//     });
// }
