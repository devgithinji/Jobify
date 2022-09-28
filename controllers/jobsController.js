import {BadRequestError, NotFoundError} from "../errors/index.js";
import Job from "../models/Job.js";
import {StatusCodes} from "http-status-codes";
import checkPermissions from "../utils/checkPermissions.js";


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
    const {id: jobId} = req.params;
    const job = await Job.findOne({_id: jobId})
    if (!job) {
        throw  new NotFoundError(`No job with id: ${jobId}`)
    }
    checkPermissions(req.user, job.createdBy)

    await job.remove();

    res.status(StatusCodes.OK).json({msg: 'Success! job removed'})
}

export const getAllJobs = async (req, res) => {
    const jobs = await Job.find({createdBy: req.user.userId});

    res.status(StatusCodes.OK).json({jobs, totalJobs: jobs.length, numOfPages: 1})
}

export const updateJob = async (req, res) => {
    const {id: jobId} = req.params;
    const {company, position} = req.body;
    if (!company || !position) {
        throw  new BadRequestError('Please Provide All Values')
    }
    const job = await Job.findOne({_id: jobId})

    if (!job) {
        throw new NotFoundError(`No job with id ${jobId}`)
    }

    //check permissions
    checkPermissions(req.user, job.createdBy)

    const updatedJob = await Job.findOneAndUpdate({_id: jobId}, req.body, {
        new: true,
        runValidators: true
    })

    res.status(StatusCodes.OK).json({updatedJob})
}

export const showStats = async (req, res) => {
    res.send('show stats')
}