import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
var _ = require('lodash');


const pcUrl = 'https://gist.githubusercontent.com/isuvorov/ce6b8d87983611482aac89f6d7bc0037/raw/pc.json';
let pc = {};
fetch(pcUrl)
  .then(async (res) => {
    pc = await res.json();
  })
  .catch(err => {
    console.log('Чтото пошло не так:', err);
  });

const app = express();
app.use(cors());

app.get('/task3A/:id1?/:id2?/:id3?', function(req, res) {
  console.log("id1 = " + req.params.id1);
  console.log("id2 = " + req.params.id2);
  console.log("id3 = " + req.params.id3);
  let hdd = {};
  if (req.params.id1 === `volumes`) {
    pc.hdd.forEach((item)=>{
      hdd[item.volume] = hdd[item.volume] || 0;
      hdd[item.volume] += item.size;
    });
    pc.hdd.forEach((item)=>{
      if (hdd[item.volume].toString().slice(-1)!==`B`) {
        hdd[item.volume]+=`B`;
      }
    });
    return res.json(hdd);
  }
  else if (req.params.id1 === undefined){
    return res.json(pc);
  }
  else if (req.params.id2 === undefined){
    if (_.has(pc,`${req.params.id1}`)){
      return res.json(_.get(pc,`${req.params.id1}`));
    }
    else res.sendStatus(404);
  }
  else if (req.params.id3 === undefined){
    if (_.has(pc,`${req.params.id1}.${req.params.id2}`)){
    return res.json(_.get(pc,`${req.params.id1}.${req.params.id2}`,"Not Found"));
    }
    else res.sendStatus(404);
  }
  else{
    if (_.has(pc,`${req.params.id1}.${req.params.id2}.${req.params.id3}`)){
    return res.json(_.get(pc,`${req.params.id1}.${req.params.id2}.${req.params.id3}`,"Not Found"));
    }
    else res.sendStatus(404);
  }
});

//  res.send(name);



app.listen(3000, () => {
  console.log('Your app listening on port 3000!');
});
