export const sendSuccess = (
    res,
    content,
    message = "Success",
    statusCode = 200
) => {
    return res.status(statusCode).json({
        statusCode,
        message,
        content,
    });
};

export const sendError = (
    res,
    error,
    statusCode = 500,
    fallbackMessage = "Internal server error"
) => {
    if (error) {
        console.error(error);
    }

    const message = error?.message || fallbackMessage;

    return res.status(statusCode).json({
        statusCode,
        message,
        content: null,
    });
};
