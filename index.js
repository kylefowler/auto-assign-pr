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
      robot.log(payload.pull_request)
      const reviewerIndex = payload.pull_request.number % reviewers.length;
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
