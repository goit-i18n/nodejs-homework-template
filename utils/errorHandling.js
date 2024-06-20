export const STATUS_CODES = {
	success: 200,
	error: 500,
	notFound: 404,
	badRequest: 400,
	unauthorized: 401,
};

export const respondWithError = (
	res,
	error,
	statusCode = STATUS_CODES.error
) => {
	res
		.status(statusCode)
		.json({ message: error.message || "An error occurred" });
};
