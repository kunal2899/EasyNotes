import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import { cssNumber } from 'jquery';
import { AUTHENTICATED_USER, AuthService, TOKEN, TOKEN_EXPIRY, USER_ID } from '../service/auth.service';
declare var webkitSpeechRecognition: any;
import { NoteService } from '../service/dash/note.service';
export class Note{
  constructor(
    public title:string,
    public content:string
  ){}
}
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  fname:string;
  pinlist = []
  pinnotes = []
  loading = false;

  constructor(public us:AuthService, private router:Router, private ns:NoteService) { 
    this.us.findUserByUsername(sessionStorage.getItem(AUTHENTICATED_USER)).subscribe(
      data=>{
        let n = data.user.first_name
        this.fname = n.toUpperCase()[0] + n.substr(1,n.length)
      }
    )
  }

  // n:Note[] = [new Note("Good Morning","hey to all"),new Note("Good afternoon","hey to all")]
  
  logout(){
    let c = confirm('Are you sure to log out?')
    if(c){
    this.us.logout().subscribe(
      result =>{
        sessionStorage.removeItem(AUTHENTICATED_USER);
        sessionStorage.removeItem(TOKEN);
        sessionStorage.removeItem(USER_ID);
        sessionStorage.removeItem(TOKEN_EXPIRY);
        this.router.navigate(['login'])
      },
      error=>{
        console.log(error);
      }
    )
    }
  }

  cn = new Note('','');
  un = new Note('','')
  e = ''

  save(){
    if(this.cn.title != '' || this.cn.content != ''){
      if(this.cn.title == ''){
          this.cn.title = ""+$('#acontent').val()
          this.cn.content = ''
      }
      let n = {}
      n["title"] = this.cn.title
      // if(this.cn.content.length)
      // n["content"] = this.cn.content
      // else
      n["content"] = $('#acontent').val()
      let bg = $('.add').css('background')
      let u = bg.split(" n")[0].trim()
      // console.log(u)

      this.ns.addNote(this.us.getAuthenticatedUser(),n,u).subscribe(
        response => {
          $('.main').removeClass('blur');
          $('.nav-buttons').removeClass('blur');
          $('.add').removeClass('active');
          $('.add .colors').removeClass('active');
          $('.add .controls .choose').removeClass('active');
          this.notes_avl = []
          this.pinnotes = []
          this.aspeech.abort()
          this.refreshAll()
          $('#acontent').val('')
          this.cn = new Note('','')
        },
        error=>{
          this.e = "Some error occured, please try again later :("
          console.log(error)
          setTimeout(()=>{this.e=""},3000)
          this.cn = new Note('','')
        }
      )
    }
    else{
      this.e = "Fields shouldn't be empty"
      setTimeout(()=>{this.e=""},3000)
    }
  }

  open(n){
    $("#n"+n+" .spinner").css('visibility','visible');
    $("#n"+n+" .notspinner").css('display','none');

    // this.loading = true;
    if(this.pinlist.includes(n)){
      $('.edit .pin').addClass('d-none')
      $('.edit .unpin').removeClass('d-none')
    }
    else{
      $('.edit .pin').removeClass('d-none')
      $('.edit .unpin').addClass('d-none')
    }
    this.ns.get(n).subscribe(
      response=>{
        // this.loading = false;
        this.un = new Note(response.user.title,response.user.content)
        $("#n"+n+" .spinner").css('visibility','hidden');
        $("#n"+n+" .notspinner").css('display','block');
        $('.main').addClass('blur');
        $('.nav-buttons').addClass('blur');
        $('.edit').addClass('active');
        $('.edit').css('background',response.user.color);
        $('.edit .noteid').val(response.user.id)
      }
    )
      
  }

  update(){
    if(this.un.title != '' || this.un.content != ''){
      if(this.un.title == ''){
          this.un.title = ""+$('#econtent').val()
          this.un.content = ''
      }
      let n = {}
      n["title"] = this.un.title
      n["content"] = $('#econtent').val()
      let bg = $('.edit').css('background')
      let u = bg.split(" n")[0].trim()
      n["color"] = u
      // console.log(u)

      let nid = $('.edit .noteid').val()

      this.ns.updateNote(this.us.getAuthenticatedUser(),nid,n).subscribe(
        response => {
          $('.main').removeClass('blur');
          $('.nav-buttons').removeClass('blur');
          $('.edit').removeClass('active');
          $('.edit .colors').removeClass('active');
          $('.edit .controls .choose').removeClass('active');
          $('.edit .ro').attr('readonly','true');
          $('.edit .sub').addClass('d-none');
          $('.edit .upd').removeClass('d-none');
          $('.edit .cc').addClass('d-none');
          this.notes_avl = []
          this.pinnotes = []
          this.refreshAll()
          this.espeech.abort()
          $('#econtent').val('')
          this.un = new Note('','')
        },
        error=>{
          this.e = "Some error occured, please try again later :("
          console.log(error)
          setTimeout(()=>{this.e=""},3000)
          this.cn = new Note('','')
        }
      )
    }
    else{
      this.e = "Fields shouldn't be empty"
      setTimeout(()=>{this.e=""},3000)
    }
  }

  remove(){
    let nid = $('.edit .noteid').val()
    if(confirm("Are you sure to delete that note, changes are irrevertible.")){
      this.ns.remove(nid).subscribe(
        response => {
          $('.main').removeClass('blur');
          $('.nav-buttons').removeClass('blur');
          $('.edit').removeClass('active');
          $('.edit .colors').removeClass('active');
          $('.edit .controls .choose').removeClass('active');
          $('.edit .ro').attr('readonly','true');
          $('.edit .sub').addClass('d-none');
          $('.edit .upd').removeClass('d-none');
          $('.edit .cc').addClass('d-none');
          this.notes_avl = []
          this.pinnotes = []
          this.refreshAll()
          this.un = new Note('','')
        },
        error=>{
          this.e = "Some error occured, please try again later :("
          console.log(error)
          setTimeout(()=>{this.e=""},3000)
          this.cn = new Note('','')
        }
      )
    }
  }

  

  pin(){
    let nid = $('.edit .noteid').val()
    this.ns.setPin(this.us.getAuthenticatedUser(),nid).subscribe(
      response=>{
        let found = false
          for(var i =0;i<this.pinlist.length;i++){
            if(nid == this.pinlist[i]){
              this.pinlist.splice(i,1)
              found = true
              break
            }
          }
          if(!found){
            let x = parseInt(nid+"")
            this.pinlist.push(x)
          }
          $('.main').removeClass('blur');
          $('.nav-buttons').removeClass('blur');
          $('.edit').removeClass('active');
          $('.edit .colors').removeClass('active');
          $('.edit .controls .choose').removeClass('active');
          $('.edit .ro').attr('readonly','true');
          $('.edit .sub').addClass('d-none');
          $('.edit .upd').removeClass('d-none');
          $('.edit .cc').addClass('d-none');
          this.notes_avl = []
          this.pinnotes = []
          this.refreshAll()
          // console.log(this.pinlist)
      }
    )
  }

  cr(){
      $('.main').addClass('blur');
      $('.nav-buttons').addClass('blur');
      $('.add').addClass('active');
  }

  notes_avl = []

  loaded = true;

  refreshAll(){
    let now = new Date()
    let pipe = new DatePipe('en-us').transform(now,'yyyy-MM-dd')
    this.loaded = false;
    this.ns.getAll(this.us.getAuthenticatedUser(),'0',pipe).subscribe(
      response=>{
        // console.log(response)
        this.loaded = true;
        let key:Array<string> = response.keys
        key.forEach(x => {
          let frame = []
          let y = response.notes[x]
          if(x.includes("TODAY")){
            frame.push("TODAY")
          }
          else if(x.includes("YESTERDAY")){
            frame.push("YESTERDAY")
          }
          else{
            frame.push(x)
          }
          frame.push([])
          y.forEach(i => {
            i["created_on"] = new Date(i["created_on"])
            if(i["pinned"]){
              this.pinlist.push(i["id"])
              this.pinnotes.push(i)
            }
            frame[1].push(i)
          });
          frame[1].sort((a,b)=>b.created_on - a.created_on)
          frame.push(new Date(x))
          this.notes_avl.push(frame)
        });
        this.notes_avl.sort((a,b)=> b[2]-a[2])
        // console.log(this.notes_avl)
      }
    )
  }

  espeech = new webkitSpeechRecognition()

  etype(){
    var ebox = $('#econtent')
    var econtentfill = ''
    this.espeech.continuous = true
    this.espeech.lang = 'en'

    this.espeech.onstart = function(e){
      $('#ev-type .vt').text("Listening")
      $('#ev-type').addClass('active')
    }

    this.espeech.onend = function(e){
      $('#ev-type').removeClass('active')
      $('#ev-type .vt').text("Voice type")
    }

    this.espeech.onspeechend = function(e){
      $('#ev-type .vt').text("No activity")
      setTimeout(()=>{
        this.aspeech.abort()
        $('#ev-type').removeClass('active')
        $('#ev-type .vt').text("Voice type")
      },2000)
    }

    this.espeech.onerror = function(e){
      $('#ev-type .vt').text("Try again")
      if(e.error == 'network'){
        alert('No network connection :/')
      }
      setTimeout(()=>{
        this.aspeech.abort()
        $('#ev-type').removeClass('active')
        $('#ev-type .vt').text("Voice type")
      },2000)
    }

    this.espeech.onresult = function(e){
      var curr = e.resultIndex
      var trans = e.results[curr][0].transcript
      // console.log(e.results)
      econtentfill += trans
      ebox.val(econtentfill)
    }

    ebox.on('input',function(){
      econtentfill = ''
      econtentfill += $(this).val()
    })

    if($('#ev-type').hasClass('active')){
      this.espeech.abort()
    }
    else{
      if(ebox.val())
        econtentfill += ebox.val()+' ' 
      else
        econtentfill = ''
      this.espeech.start()
    }
  }

  aspeech = new webkitSpeechRecognition()

  type(){
    // var aspeech = new SpeechRecognition()
    var abox = $('#acontent')
    var contentfill = ''
    this.aspeech.continuous = true
    this.aspeech.lang = 'en'

    this.aspeech.onstart = function(e){
      $('#av-type .vt').text("Listening")
      $('#av-type').addClass('active')
    }

    this.aspeech.onend = function(e){
      $('#av-type').removeClass('active')
      $('#av-type .vt').text("Voice type")
    }

    this.aspeech.onspeechend = function(e){
      $('#av-type .vt').text("No activity")
      setTimeout(()=>{
        this.aspeech.abort()
        $('#av-type').removeClass('active')
        $('#av-type .vt').text("Voice type")
      },2000)
    }

    this.aspeech.onerror = function(e){
      $('#av-type .vt').text("Try again")
      if(e.error == 'network'){
        alert('No network connection :/')
      }
      setTimeout(()=>{
        this.aspeech.abort()
        $('#av-type').removeClass('active')
        $('#av-type .vt').text("Voice type")
      },2000)
    }

    this.aspeech.onresult = function(e){
      var curr = e.resultIndex
      var trans = e.results[curr][0].transcript
      // console.log(e.results)
      contentfill += trans
      abox.val(contentfill)
    }

    abox.on('input',function(){
      contentfill = ''
      contentfill += $(this).val()
    })

    if($('#av-type').hasClass('active')){
      this.aspeech.abort()
    }
    else{
      if(abox.val())
        contentfill += abox.val()+' ' 
      else
        contentfill = ''
      this.aspeech.start()
    }
  }

  ngOnInit(): void {

    var asp = this.aspeech
    this.refreshAll()
    // setTimeout(()=>{console.log(this.pinlist)},2000)

    $('.edu .create').on('click',function(){
      $('.main').addClass('blur');
      $('.nav-buttons').addClass('blur');
      $('.menu-btn').addClass('blur');
      $('.add').addClass('active');
    })

    $('.menu-btn').on('click',function(){
      if($(this).hasClass('open')){
        $(this).removeClass('open');
        $('.expand').css('transform','translateX(100%)');
      }else{
        $(this).addClass('open');
        $('.expand').css('transform','translateX(0)');
      }
  });

    $('.add .controls .close').on('click',function(){
      asp.abort()
      $('.main').removeClass('blur');
      $('.nav-buttons').removeClass('blur');
      $('.add').removeClass('active');
      $('.menu-btn').removeClass('blur');
      $('.add .colors').removeClass('active');
      $('.add .controls .choose').removeClass('active');
    })
    $('.edit .upd').on('click',function(){
      $(this).addClass('d-none');
      $('.edit .cc').removeClass('d-none');
      $('.edit .ro').removeAttr('readonly');
      $('.edit .sub').removeClass('d-none');
    })

    $('.edit .controls .pin .fa-thumbtack').on('click',function(){
      alert('kl')
      if($(this).hasClass('far'))
        $(this).removeClass('far').addClass('fas')
      else
        $(this).removeClass('fas').addClass('far')
    })

    // var b;
    // function componentToHex(c) {
    //   var hex = c.toString(16);
    //   return hex.length == 1 ? "0" + hex : hex;
    // }
    // function rgbToHex(r, g, b) {
    //   return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
    // }

    $('.edit .controls .close').on('click',function(){
      $('.main').removeClass('blur');
      $('.nav-buttons').removeClass('blur');
      $('.edit').removeClass('active');
      $('.edit .ro').attr('readonly','true');
      $('.edit .sub').addClass('d-none');
      $('.edit .upd').removeClass('d-none');
      $('.edit .cc').addClass('d-none');
      // $('.edit').css('background',b);
      // let u = b.split(" n")[0]
      // let r = rgbToHex(4,5,6)
      // switch(b){
      //   case '#6cff7d': $(".green").removeClass('d-none').parent().siblings().children().addClass('d-none'); break;
      //   case '#fff740': $(".yellow").removeClass('d-none').parent().siblings().children().addClass('d-none'); break;
      //   case '#7afcff': $(".blue").removeClass('d-none').parent().siblings().children().addClass('d-none'); break;
      //   case '#feff9c': $(".skin").removeClass('d-none').parent().siblings().children().addClass('d-none'); break;
      //   case '#ff4356': $(".red").removeClass('d-none').parent().siblings().children().addClass('d-none'); break;
      // }
      $('.edit .colors').removeClass('active');
      $('.edit .controls .choose').removeClass('active');
    })
    $('.add .controls .choose').on('click',function(){
      if($(this).hasClass('active')){
        $('.add .colors').removeClass('active');
        $(this).removeClass('active');
      }else{
      $('.add .colors').addClass('active');
      $(this).addClass('active');
      }
    })
    $('.add .colors').children().each(function(x,e){
        $(e).on('click',function(){
          switch(x){
            case 0:$('.add').css('background','#6cff7d');
            $(".green").removeClass('d-none').parent().siblings().children().addClass('d-none');
            break;
            case 1:$('.add').css('background','#fff740');
            $(".yellow").removeClass('d-none').parent().siblings().children().addClass('d-none'); break;
            case 2:$('.add').css('background','#7afcff');
            $(".blue").removeClass('d-none').parent().siblings().children().addClass('d-none'); break;
            case 3:$('.add').css('background','#feff9c');
            $(".skin").removeClass('d-none').parent().siblings().children().addClass('d-none'); break;
            case 4:$('.add').css('background','#ff4356');
            $(".red").removeClass('d-none').parent().siblings().children().addClass('d-none'); break;
          }
          $('.add .colors').removeClass('active');
          $('.add .choose').removeClass('active');
        })
    })
    $('.edit .controls .choose').on('click',function(){
      if($(this).hasClass('active')){
        $('.edit .colors').removeClass('active');
        $(this).removeClass('active');
      }else{
      $('.edit .colors').addClass('active');
      $(this).addClass('active');
      }
    })
    
    $('.edit .colors').children().each(function(x,e){
        // b = $('.edit').css('background');
        $(e).on('click',function(){
          switch(x){
            case 0:$('.edit').css('background','#6cff7d');
            $(".green").removeClass('d-none').parent().siblings().children().addClass('d-none');
            break;
            case 1:$('.edit').css('background','#fff740');
            $(".yellow").removeClass('d-none').parent().siblings().children().addClass('d-none'); break;
            case 2:$('.edit').css('background','#7afcff');
            $(".blue").removeClass('d-none').parent().siblings().children().addClass('d-none'); break;
            case 3:$('.edit').css('background','#feff9c');
            $(".skin").removeClass('d-none').parent().siblings().children().addClass('d-none'); break;
            case 4:$('.edit').css('background','#ff4356');
            $(".red").removeClass('d-none').parent().siblings().children().addClass('d-none'); break;
          }
          $('.edit .colors').removeClass('active');
          $('.edit .choose').removeClass('active');
        })
    })

  }

}
