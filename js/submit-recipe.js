// AI Cooking Assistant
// Recipe Submission Controller

const SUBMISSIONS_KEY =
    "aiCookingSubmissions";

function getRecipeSubmissions() {
    try {
        return JSON.parse(
            localStorage.getItem(
                SUBMISSIONS_KEY
            )
        ) || [];
    } catch {
        return [];
    }
}

function saveRecipeSubmissions(
    submissions
) {
    localStorage.setItem(
        SUBMISSIONS_KEY,
        JSON.stringify(submissions)
    );
}

function submitRecipe(recipeData) {
    const submissions =
        getRecipeSubmissions();

    const user =
        JSON.parse(
            localStorage.getItem(
                "aiCookingUser"
            )
        );

    const submission = {
        id:
            `user-recipe-${Date.now()}`,

        ...recipeData,

        submittedBy:
            user?.name || "Guest User",

        status: "pending",

        submittedAt:
            new Date().toISOString()
    };

    submissions.push(submission);

    saveRecipeSubmissions(
        submissions
    );

    return submission;
}

function getPendingSubmissions() {
    return getRecipeSubmissions()
        .filter(
            item =>
                item.status === "pending"
        );
}

function getApprovedSubmissions() {
    return getRecipeSubmissions()
        .filter(
            item =>
                item.status === "approved"
        );
}

function updateSubmissionStatus(
    submissionId,
    status
) {
    const submissions =
        getRecipeSubmissions();

    const submission =
        submissions.find(
            item =>
                item.id === submissionId
        );

    if (!submission) {
        return false;
    }

    submission.status = status;

    saveRecipeSubmissions(
        submissions
    );

    return true;
}

window.submitRecipe =
    submitRecipe;

window.getRecipeSubmissions =
    getRecipeSubmissions;

window.getPendingSubmissions =
    getPendingSubmissions;

window.getApprovedSubmissions =
    getApprovedSubmissions;

window.updateSubmissionStatus =
    updateSubmissionStatus;