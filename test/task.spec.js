var createTask = require('../lib/task')
var es = require('event-stream')
var sinon = require('sinon')

describe('task', function() {

	it('ends the collector when the stream ends', function(done) {
		var task = createTask()
		var end = sinon.spy(task.collector, 'end')
		es.readArray([])
			.pipe(task)
			.pipe(es.wait(function() {
				end.calledOnce.should.be.true
				done()
			}))
	})

	it('emits a prepare event and stores the context and config', function(done) {
		var task = createTask()
		es.readArray([{conf:'conf',context:'context'}])
			.pipe(task)
			.on('prepare', function(prepare) {
				this.config.should.eql('conf')
				this.context.should.eql('context')
				prepare.should.eql({conf:'conf',context:'context'})
				done()
			})
	})

	it('emits an event for each command', function(done) {
		var task = createTask()
		es.readArray([{command:'next'}])
			.pipe(task)
			.on('next', function(data) {
				data.should.eql({command:'next'})
				done()
			})
	})

	it('emits an event for each tasks array', function(done) {
		var task = createTask()
		es.readArray([ [1,2] ])
			.pipe(task)
			.on('tasks', function(array) {
				array.should.eql([1,2])
				done()
			})
	})

	it('emits an event for each tuple', function(done) {
		var task = createTask()
		es.readArray([{id:1}])
			.pipe(task)
			.on('tuple', function(data) {
				data.should.eql({id:1})
				done()
			})
	})

})
