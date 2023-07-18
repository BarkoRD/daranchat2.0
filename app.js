const express = require('express')
const {pool} = require('./database.js')
const app = express()
const cookieParser = require('cookie-parser')
const session = require('express-session')
const { Server: SServer } = require('socket.io');
const http = require('http')

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}))
app.use(cookieParser('suricata'))
const sessionMiddleware = session({
    secret: 'gatocalvo',
    resave: true,
    saveUninitialized: true
  });
  app.use(sessionMiddleware);

const messages = []

const server = http.createServer(app)
const io = new SServer(server)





io.use((socket, next) => {
    sessionMiddleware(socket.request, {}, next);
  });

  let onlineUsers = 0;

  io.on('connection', (socket) => {
    console.log('New Connection:', socket.id);
    socket.emit('updateOnlineUsers', onlineUsers);
  
    // Incrementar el contador de usuarios en línea
    onlineUsers++;
    io.emit('updateOnlineUsers', onlineUsers);
  
    socket.on('disconnect', () => {
      console.log('User Disconnected:', socket.id);
  
      // Decrementar el contador de usuarios en línea
      onlineUsers--;
      io.emit('updateOnlineUsers', onlineUsers);
    });
  

    const sessionweb = socket.request.session;
    

    socket.emit('loadMessages', messages)
    socket.on('client:newmessage', message => {
        if(sessionweb.loggedin){
      
        let msgWithOwner = {
            owner: sessionweb.name,
            message: message.message,
            id: message.id,
            type: 'message'
        } 
        
        console.log(msgWithOwner)
        messages.push(msgWithOwner);

        io.sockets.emit('server:newmessage', msgWithOwner);
    }else{

        io.sockets.emit('server:reload'); // Enviar evento de recarga
  }
    });


    socket.on('client:newaudio', audio => {
        let audioWithOwner = {
            audio: audio.audio,
            owner: sessionweb.name,
            id: audio.id,
            type: 'audio'
            
        } 
        
        console.log(audioWithOwner)
        messages.push(audioWithOwner);

        io.sockets.emit('server:newaudio', audioWithOwner);
    });

    socket.on('client:newvideo', video => {
        let videoWithOwner = {
            video: video.video,
            owner: sessionweb.name,
            id: video.id,
            type: 'video'
            
        } 
        
        console.log(videoWithOwner)
        messages.push(videoWithOwner);

        io.sockets.emit('server:newvideo', videoWithOwner);
    });

    socket.on('client:requestusername',()=>{
        let username = session.name
        socket.emit('server:username',username)

    })
    
    
})


app.get('/',(req,res)=>{
    res.redirect('/index')
})

app.get('/index',async (req,res)=>{
    if (req.session.loggedin) {
        let error = ''

        res.render('index',{ error });
      } else {
        const error = 'ingrese su codigo de acceso para acceder al chat'
        res.render('login',{ error });
      }
})

app.get('/login',async (req,res)=>{
    let error = ''
    res.render('login',{ error })
})

app.get('/register',async (req,res)=>{
    let error = ''
    res.render('register',{error:error})
})

app.post('/register',async(req,res)=>{
    console.log(req.body)
    const {name, accesscode} = req.body;
    const newdata = {name, accesscode}
    const [data] = await pool.promise().query('SELECT * FROM chatters WHERE accesscode = ?',[accesscode])
    if(data.length > 0){
        let error = 'Disculpe este codigo de acceso no esta disponible'
        res.render('register', {error:error})
    }else{
    console.log(newdata)
    await pool.promise().query('INSERT INTO chatters SET ?',newdata)
    res.redirect('/login')
}
})

app.post('/login', async (req, res) => {
    const accesscode = req.body.accesscode;

    const [data] = await pool.promise().query('SELECT * FROM chatters WHERE accesscode = ?',[accesscode])
    
    if (data.length > 0) {
        req.session.name = data[0].name
      req.session.loggedin = true;
      res.redirect('/index');
    } else {
        const error = 'contraseña incorrecta'
        res.render('login',{error});
    }
  });

app.get('/logout',(req,res)=>{

    req.session.destroy();
    res.redirect('/login')
})

server.listen(process.env.PORT || 3000,()=>{
    console.log('si')
})