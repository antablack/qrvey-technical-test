
const { user, project, task } = require("../../services")
const { User, Task, Project } = require("../../models")
const { constants, validators } = require("../../utils")

const chai = require("chai")
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

const should = chai.should()
const expect = chai.expect
const assert = chai.assert
const config = require("../../config")
const mongoose = require("mongoose")

before("connect", function (done) {
  mongoose.connect(config.HOST).then(() => {
    console.log("connections database successful...");
    mongoose.connection.db.dropDatabase();
    done()
  }).catch((err) => {
    console.log("error database Connection -->" + err)
  })
});

describe('Services', function () {
  describe('User#create()', function () {
    it('Should not create a user - valid mandatory fields', async function () {
      await expect(user.create({})).to.eventually.be.rejected;
    });

    it('Should no create a user - invalid fullName', async function () {
      await expect(user.create({
        fullName: "",
        email: "test@gmail.com",
        password: "M3d3ll1n"
      })).to.eventually.be.rejected;
    });

    it('Should no create a user - invalid email', async function () {
      await expect(user.create({
        fullName: "juan.sanchez",
        email: "test@gmail.cm",
        password: "M3d3ll1n"
      })).to.eventually.be.rejected;
    });

    it('Should no create a user - invalid password', async function () {

      await expect(user.create({
        fullName: "juan.sanchez",
        email: "test@gmail.com",
        password: ""
      })).to.eventually.be.rejected;

    });

    it('Should create a user', async function () {
      await user.create({
        fullName: "juan.sanchez",
        email: "test@gmail.com",
        password: "M3d3ll1n"
      })
    });
  });

  describe('User#signin()', function () {
    it('Should not Sign In - Invalid email/password', async function () {
      await expect(user.signIn({})).to.eventually.be.rejected;
    });

    it('Should Sign In', async function () {
      await expect(user.signIn({ email: "test@gmail.com", password: "M3d3ll1n" })).to.eventually.be.a('string');
    });

    it('Get time spent of all users', async function () {
      await expect(user.getTimeUsers()).to.eventually.be.a('array');
    });
  });


  describe('Task#crud', function () {
    it('Should create project - Invalid Data ', async function () {
      const dUser = await User.findOne({email: "test@gmail.com"})
      await task.create(dUser._id, {name: "make wireframe", duration: 100})
    });

    it('Should not create Task - Invalid Data ', async function () {
      const dUser = await User.findOne({email: "test@gmail.com"})
      await task.create(dUser._id, {})
    });

    it('Should continue a task', async function () {
      const dUser = await User.findOne({email: "test@gmail.com"})
      const dTask = await Task.findOne({})
      await task.continue(dUser._id, dTask._id)
    });

    
    it('List all Task', async function () {
      const dUser = await User.findOne({email: "test@gmail.com"})
      await expect(task.listAll(dUser._id)).to.eventually.be.a("array")
    });

    it('Restart task', async function () {
      const dUser = await User.findOne({email: "test@gmail.com"})
      let dTask = await Task.findOne({})
      const data = {
        userId: dUser._id.toString(),
        taskId: dTask._id.toString(),
        duration: 155,
        state: constants.TASK_STATE.RESTARTED
      }
      await task.changeOfState(data)
      dTask = await Task.findOne({})
      console.log(dTask.duration)
      expect(dTask.duration).to.be.equal(0)
    });

    it('Pause task', async function () {
      const dUser = await User.findOne({email: "test@gmail.com"})
      let dTask = await Task.findOne({})
      const data = {
        userId: dUser._id.toString(),
        taskId: dTask._id.toString(),
        duration: 155,
        state: constants.TASK_STATE.PAUSED
      }
      await task.changeOfState(data)
      dTask = await Task.findOne({})
      expect(dTask.duration).to.be.equal(155)
    });

  });



  describe('Project#crud', function () {
    it('Should not create project - Invalid Data ', async function () {
      const dUser = await User.findOne({email: "test@gmail.com"})
      await expect(project.create(dUser._id, {})).to.eventually.be.rejected
    });

    it('Should create project - Invalid Data ', async function () {
      const dUser = await User.findOne({email: "test@gmail.com"})
      await project.create(dUser._id, {name: "Website design"})
    });

    it('Associate Task with project', async function () {
      const dUser = await User.findOne({email: "test@gmail.com"})
      let dTask = await Task.findOne({})
      let dProject = await Project.findOne({})

      const data = {
        userId: dUser._id.toString(), 
        taskId: dTask._id.toString(),
        projectId: dProject._id.toString(), 
      }
      await expect(project.associateTask(data)).to.eventually.not.be.a("undefined")
    });

    it('Get time spent for all project ', async function () {
      await expect(project.getTimeProjects()).to.eventually.be.a("array")
    });

    it('Get time by project by user ', async function () {
      const dUser = await User.findOne({email: "test@gmail.com"})
      let dProject = await Project.findOne({})
      await expect(project.getTimeByProjectByUser(dProject._id, dUser._id)).to.eventually.be.a("object")
    });


  });

});

after("closing db connection", function(done) {
    mongoose.connection.close().then(function() {
      done();
    });
});