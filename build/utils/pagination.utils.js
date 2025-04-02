"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPagination = void 0;
const getPagination = (page, limit, totalCount) => {
    const totalPages = Math.ceil(totalCount / limit);
    return {
        total: totalCount,
        totalPages,
        currentPage: page,
        previousPage: page > 1 ? page - 1 : null,
        nextPage: page < totalPages ? page + 1 : null,
        hastNextPage: page < totalPages ? true : false,
    };
};
exports.getPagination = getPagination;
