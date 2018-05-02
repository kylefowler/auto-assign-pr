module.exports = (robot) => {
  robot.log('Plugin was opened')
  
  robot.on('pull_request.opened', async context => {
    // An issue was just opened.
    robot.log('PR was opened')

    const {payload, github} = context;

    if (payload.pull_request.requested_reviewers.length > 0) return;

    const config = await context.config('reviewers.yml');

    if (config !== null && config.reviewers !== null && config.reviewers.length > 0) {
      const reviewers = config.reviewers
      const creator = payload.pull_request.user.login
      const requiredReviewers = 2
      var addedReviewers = 0;
      var reviewersToAdd = []
      var mod = payload.pull_request.number
      while (addedReviewers < requiredReviewers) {
        var reviewerIndex = mod % reviewers.length;
        var reviewer = reviewers[reviewerIndex];
        if (reviewer !== creator && !reviewersToAdd.includes(reviewer)) {
          reviewersToAdd.push(reviewer);
          addedReviewers++;
        }
        mod *= 17
      }
      
      await github.pullRequests.createReviewRequest(context.issue({
        reviewers: [reviewers[reviewerIndex]],
        headers: {
          accept: 'application/vnd.github.mercy-preview+json'
        }
      }));
    } else {
      robot.log("No reviewers specified for the repo")
    }
  })

  // To get your app running against GitHub, see:
  // https://probot.github.io/docs/development/
}
