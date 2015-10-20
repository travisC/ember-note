module.exports = function(app) {
  var express = require('express');
  var notesRouter = express.Router();
  var bodyParser = require('body-parser');
  app.use(bodyParser.json());
  var nedb = require('nedb');
  var noteDB = new nedb({ filename : 'notes', autoload: true});

  notesRouter.get('/', function(req, res) {
    noteDB.find(req.query).exec(function(error, users){
      res.send( {
        'notes': users
      });
    });
  });

  notesRouter.post('/', function(req, res) {
    //res.status(201).end();
    noteDB.find({}).sort({id:-1}).limit(1).exec(
      function(err,notes) {
        if(notes.length != 0)
          req.body.note.id = notes[0].id +1 ;
        else
          req.body.note.id = 1;
          noteDB.insert(req.body.note,function(err,newNote){
          res.status(201);
          res.send(
            JSON.stringify(
              {
                note:newNote
              }));
        });
      });
  });

  notesRouter.get('/:id', function(req, res) {
    res.send({
      'notes': {
        id: req.params.id
      }
    });
  });

  notesRouter.put('/:id', function(req, res) {
    res.send({
      'notes': {
        id: req.params.id
      }
    });
  });

  notesRouter.delete('/:id', function(req, res) {
    res.status(204).end();
  });

  app.use('/api/notes', notesRouter);
};
