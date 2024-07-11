const Joi = require('joi');
const jwt = require('jsonwebtoken');
const cookie = require('cookie');
const moment = require('moment');
const { Op } = require('sequelize');

const user = require('../../models/user.js');
const profile = require('../../models/profile.js');
const education = require('../../models/education.js');
const skill = require('../../models/skill.js');
const training = require('../../models/training.js');
const workhistory = require('../../models/workhistory.js');

async function form(req, res) {
    try {
        const tokenCookie = req.headers.cookie || '';
        const parsedCookies = cookie.parse(tokenCookie);
        const token = parsedCookies.token;

        if (!token) {
            return res.status(401).send({
                status: "1",
                message: "Unauthorized: Token not found in cookies"
            });
        }

        // Verify token and decode user id
        jwt.verify(token, process.env.TOKEN_KEY, async (err, decoded) => {
            if (err) {
                console.log(err);
                return res.status(401).send({
                    status: "1",
                    message: "Unauthorized: Failed to verify token"
                });
            }

            const idUser = decoded.status == "USER" ? decoded.id : req.body.userId;

            try {
                console.log("1 : " , idUser)
                let dataUser = await profile.findOne({
                    where: { idUser: idUser},
                    attributes: {
                        exclude: ["createdAt", "updatedAt", "idUser", "id"]
                    }
                });

                console.log("2 : " , idUser)
                if (!dataUser) {
                    dataUser  = await profile.create({
                        idUser : idUser
                      })
                }

                console.log("3 : " , idUser)
                let dataToken = await user.findOne({
                    where: { id:idUser },
                    attributes: {
                        exclude: ["createdAt", "updatedAt", "status", "id","password"]
                    }
                });

                const responseData = {
                    position: dataUser.position,
                    name: dataUser.name,
                    noKTP: dataUser.noKTP,
                    placeOfBirth: dataUser.placeOfBirth,
                    dateOfBirth: dataUser.dateOfBirth == null ? null :moment(dataUser.dateOfBirth).format('DD-MMM-YYYY'),
                    gender: dataUser.gender,
                    religion: dataUser.religion,
                    bloodType: dataUser.bloodType,
                    status: dataUser.status,
                    ktpAddress: dataUser.ktpAddress,
                    currentAddress: dataUser.currentAddress,
                    phoneNumber: dataUser.phoneNumber,
                    emergencyContact: dataUser.emergencyContact,
                    willingness: dataUser.willingness,
                    expectedSalery: dataUser.expectedSalery,
                    email: dataToken.email
                };

                res.status(200).send({
                    status: "0",
                    message: "Get Form Success",
                    data: responseData
                });

            } catch (error) {
                console.error('Error fetching profile:', error);
                res.status(500).send({
                    status: "1",
                    message: "Server Processing Error"
                });
            }
        });

    } catch (error) {
        console.error('Error in form function:', error);
        res.status(500).send({
            status: "1",
            message: "Server Processing Error"
        });
    }
}

async function listForms(req,res){
    try {
        const whereCondition = {};
        if (req.body.search && typeof req.body.search === 'object') {
            Object.keys(req.body.search).forEach(key => {
                if (req.body.search[key]) {
                    whereCondition[key] = {
                        [Op.like]: `%${req.body.search[key]}%`
                    };
                }
            });
        }

        whereCondition.status = {
            [Op.ne]: 'ADMIN'
          };

        const users = await profile.findAll({
            where: whereCondition,
            attributes: {
                exclude: ["createdAt", "updatedAt", "id"]
            },
            order: [
                [req.body.sort || 'createdAt', req.body.order || 'ASC'] 
            ],
            offset: req.body.offset || 0,
            limit: req.body.limit || 10
        });

        const formattedUsers = users.map(user => ({
            idUser: user.idUser,
            position: user.position,
            name: user.name,
            noKTP: user.noKTP,
            placeOfBirth: user.placeOfBirth,
            dateOfBirth: user.dateOfBirth == null ? null :moment(user.dateOfBirth).format('DD-MMM-YYYY'), 
            gender: user.gender,
            religion: user.religion,
            bloodType: user.bloodType,
            status: user.status,
            ktpAddress: user.ktpAddress,
            currentAddress: user.currentAddress,
            phoneNumber: user.phoneNumber,
            emergencyContact: user.emergencyContact,
            willingness: user.willingness,
            expectedSalery: user.expectedSalery,
        }));

        res.status(200).json({
            status: "0",
            message: "Users fetched successfully",
            data: formattedUsers
        });
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).send({
            status: "1",
            message: "Server Processing Error"
        });
    }
}

async function listEducations(req,res){
    try {
        const whereCondition = {};
        if (req.body.search && typeof req.body.search === 'object') {
            Object.keys(req.body.search).forEach(key => {
                if (req.body.search[key]) {
                    whereCondition[key] = {
                        [Op.like]: `%${req.body.search[key]}%`
                    };
                }
            });
        }

        const users = await education.findAll({
            where: whereCondition,
            attributes: {
                exclude: ["createdAt", "updatedAt", "idUser", "id"]
            },
            order: [
                [req.body.sort || 'createdAt', req.body.order || 'ASC'] 
            ]
        });

        res.status(200).json({
            status: "0",
            message: "Users fetched successfully",
            data: users,
            total: users.length
        });
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).send({
            status: "1",
            message: "Server Processing Error"
        });
    }
}

async function listSkills(req,res){
    try {
        const whereCondition = {};
        if (req.body.search && typeof req.body.search === 'object') {
            Object.keys(req.body.search).forEach(key => {
                if (req.body.search[key]) {
                    whereCondition[key] = {
                        [Op.like]: `%${req.body.search[key]}%`
                    };
                }
            });
        }

        const users = await skill.findAll({
            where: whereCondition,
            attributes: {
                exclude: ["createdAt", "updatedAt", "idUser", "id"]
            },
            order: [
                [req.body.sort || 'createdAt', req.body.order || 'ASC'] 
            ],
            offset: req.body.offset || 0,
            limit: req.body.limit || 10
        });
 

        res.status(200).json({
            status: "0",
            message: "Users fetched successfully",
            data: users
        });
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).send({
            status: "1",
            message: "Server Processing Error"
        });
    }
}

async function listTrainings(req,res){
    try {
        const whereCondition = {};
        if (req.body.search && typeof req.body.search === 'object') {
            Object.keys(req.body.search).forEach(key => {
                if (req.body.search[key]) {
                    whereCondition[key] = {
                        [Op.like]: `%${req.body.search[key]}%`
                    };
                }
            });
        }

        const users = await training.findAll({
            where: whereCondition,
            attributes: {
                exclude: ["createdAt", "updatedAt", "idUser", "id"]
            },
            order: [
                [req.body.sort || 'createdAt', req.body.order || 'ASC'] 
            ],
            offset: req.body.offset || 0,
            limit: req.body.limit || 10
        });

        res.status(200).json({
            status: "0",
            message: "Users fetched successfully",
            data: users
        });
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).send({
            status: "1",
            message: "Server Processing Error"
        });
    }
}

async function listWorkhitories(req,res){
    try {
        const whereCondition = {};
        if (req.body.search && typeof req.body.search === 'object') {
            Object.keys(req.body.search).forEach(key => {
                if (req.body.search[key]) {
                    whereCondition[key] = {
                        [Op.like]: `%${req.body.search[key]}%`
                    };
                }
            });
        }

        const users = await workhistory.findAll({
            where: whereCondition,
            attributes: {
                exclude: ["createdAt", "updatedAt", "idUser", "id"]
            },
            order: [
                [req.body.sort || 'createdAt', req.body.order || 'ASC'] 
            ],
            offset: req.body.offset || 0,
            limit: req.body.limit || 10
        });

        res.status(200).json({
            status: "0",
            message: "Users fetched successfully",
            data: users
        });
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).send({
            status: "1",
            message: "Server Processing Error"
        });
    }
}

async function updateForm(req, res) {
    try {
        const tokenCookie = req.headers.cookie || '';
        const parsedCookies = cookie.parse(tokenCookie);
        const token = parsedCookies.token;

        if (!token) {
            return res.status(401).send({
                status: "1",
                message: "Unauthorized: Token not found in cookies"
            });
        }


        const schema = Joi.object({
            userId: Joi.number().integer().allow(null).optional(),
            name: Joi.string().required(),
            position: Joi.string().required(),
            noKTP: Joi.number().integer().required(),
            placeOfBirth: Joi.string().required(),
            dateOfBirth: Joi.string().custom((value, helpers) => {
                const isoDate = convertToISODate(value);
                if (!isoDate) {
                    return helpers.error('any.invalid');
                }
                return isoDate;
            }, 'ISO 8601 Date').required(),
            gender: Joi.string().required(),
            religion: Joi.string().required(),
            bloodType: Joi.string().required(),
            status: Joi.string().required(),
            ktpAddress: Joi.string().required(),
            currentAddress: Joi.string().required(),
            phoneNumber: Joi.number().integer().required(),
            emergencyContact: Joi.string().required(),
            willingness: Joi.string().required(),
            expectedSalery: Joi.number().integer().required(),
            education: Joi.array().items(Joi.object({
                degree: Joi.string().required(),
                institution: Joi.string().required(),
                major: Joi.string().required(),
                year: Joi.number().integer().required(),
                gpa: Joi.number().integer().required(),
            })).required(),
            training: Joi.array().items(Joi.object({
                trainingName: Joi.string().required(),
                certification: Joi.string().required(),
                year: Joi.number().integer().required(),
            })).required(),
            workHistory: Joi.array().items(Joi.object({
                company: Joi.string().required(),
                position: Joi.string().required(),
                lastSalery: Joi.number().integer().required(),
                year: Joi.number().integer().required(),
            })).required(),
            skills: Joi.array().items(Joi.object({
                skill: Joi.string().required(),
            })).required()
        });

        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({
                status: "1",
                message: error.details[0].message
            });
        }

        const decoded = jwt.verify(token, process.env.TOKEN_KEY);

        const idUser = decoded.status === "USER" ? decoded.id : req.body.userId;

        const updatedProfile = await profile.update(
            { ...req.body },
            { where: { idUser } }
        );

        

        const updatedData = await profile.findOne({
            where: { idUser },
            attributes: {
                exclude: ["createdAt", "updatedAt", "idUser", "id"]
            }
        });

        const deleteEducation = await education.destroy({
            where: { idUser }
        });

        const deleteTraining = await training.destroy({
            where: { idUser }
        });

        const deleteSkill = await skill.destroy({
            where: { idUser }
        });

        const deleteWorkhistories = await workhistory.destroy({
            where: { idUser }
        });

        skill.bulkCreate(req.body.skills.map(skill => ({ ...skill, idUser }))),
        workhistory.bulkCreate(req.body.workHistory.map(work => ({ ...work, idUser }))),
        education.bulkCreate(req.body.education.map(edu => ({ ...edu, idUser }))),
        training.bulkCreate(req.body.training.map(train => ({ ...train, idUser })))

        res.status(200).json({
            status: "0",
            message: "Profile updated successfully",
            data: updatedData
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({
            status: "1",
            message: "Failed to update profile",
            error: error.message
        });
    }
}

async function deleteForm(req, res) {
    try {
        const { id } = req.body;

        const tokenCookie = req.headers.cookie || '';
        const parsedCookies = cookie.parse(tokenCookie);
        const token = parsedCookies.token;

        if (!token) {
            return res.status(401).send({
                status: "1",
                message: "Unauthorized: Token not found in cookies"
            });
        }

        const decoded = jwt.verify(token, process.env.TOKEN_KEY);

        const adminUser = await user.findOne({
            where: { id: decoded.id }
        });

        if (!adminUser || adminUser.status !== "ADMIN") {
            return res.status(403).send({
                status: "1",
                message: "Forbidden: Only ADMIN can perform this operation"
            });
        }

        await profile.destroy({
            where: { idUser: id }
        });

        await education.destroy({
            where: { idUser: id }
        });

        await skill.destroy({
            where: { idUser: id }
        });

        await training.destroy({
            where: { idUser: id }
        });

        await workhistory.destroy({
            where: { idUser: id }
        });

        await user.destroy({
            where: { id: id }
        });

        res.status(200).json({
            status: "0",
            message: "Data successfully deleted"
        });
    } catch (error) {
        console.error('Error deleting data:', error);
        res.status(500).json({
            status: "1",
            message: "Failed to delete data",
            error: error.message
        });
    }
}

function convertToISODate(inputDate) {
    const months = {
        "Jan": "01", "Feb": "02", "Mar": "03", "Apr": "04", "May": "05", "Jun": "06",
        "Jul": "07", "Aug": "08", "Sep": "09", "Oct": "10", "Nov": "11", "Dec": "12"
    };

    const parts = inputDate.split('-');

    const isoDate = `${parts[2]}-${months[parts[1]]}-${parts[0].padStart(2, '0')}`;

    return isoDate;
}



module.exports = { form, listForms ,listEducations, listSkills, listTrainings, listWorkhitories, updateForm, deleteForm};
