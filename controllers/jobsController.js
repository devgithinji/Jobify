import {BadRequestError} from "../errors/index.js";
import Job from "../models/Job.js";
import {StatusCodes} from "http-status-codes";

export const createJob = async (req, res) => {
    const {position, company} = req.body;
    if (!position || !company) {
        throw  new BadRequestError('Please Provide All Values')
    }

    req.body.createdBy = req.user.userId;
    const job = await Job.create(req.body);

    res.status(StatusCodes.CREATED).json({job})
}

export const deleteJob = async (req, res) => {
    res.send('delete job')
}

export const getAllJobs = async (req, res) => {
    res.send('get all jobs')
}

export const updateJob = async (req, res) => {
    res.send('update job')
}

export const showStats = async (req, res) => {
    res.send('show stats')
}