Vue.directive('scroll', {
  inserted: function (el, binding) {
    let f = function (evt) {
      if (binding.value(evt, el)) {
        window.removeEventListener('scroll', f)
      }
    }
    window.addEventListener('scroll', f)
  }
})

var nav = new Vue({
  el:'#nav',
  data:{
    color: 'blue',
    count: 0
  }
})

var app = new Vue({
  el: '#app',
  data: {
    color: '',
    color2: 'black',
    color3: '',
    count: 0,
    message:'',
    foto:''
	},methods:{
    distance: function(element){
      var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      this.count = (winScroll / height) * 100;
      nav.count = this.count;
    }
  }
  ,watch :{
      count: function(value){
        var vm = this;
        var r,g,b;
        vm.color2 = 'rgba(0,0,0,'+(vm.count/100)+')';
        if(vm.count >=85){
          r = 255;
          g = 255;
          b = vm.count*2.55;
          vm.color3 = 'rgba(255,255,255,'+(1-(100-vm.count)/33.3333)+')';
          vm.foto = "<img src='https://i.imgsafe.org/69/69b475a0f7.jpeg'>"
          vm.message = "<h1>&nbspSobre Mim</h1> "+
                      " <p>&nbspSou aluno do 8&ordm per&iacuteodo de  Engenharia de Produ&ccedil&atildeo pela Universidade Federal do Rio Grande do Norte,<br>"+
                      " &nbspcom interesses em pesquisa operacional, otimiza&ccedil&atildeo e aprendizado de m&aacutequina. Fa&ccedilo pesquisa no HEII  <br> "+
                      "&nbsp(Healthcare, Engineering and Industrial Innovation). Tenho experi&ecircncia em programa&ccedil&atildeo nas linguagens <br>&nbspPython, Matlab, C, C++, Java e Javascript.<br><br>"+
                      "<a class='btn' href='https://www.github.com/varellalexandre'>Meu Reposit&oacuterio</a><a class='btn' href='https://www.linkedin.com/in/alexandre-varella-93b6b8140/e'>Meu linkedin</a>";
        }else if(vm.count >=66.66){
          r = 255;
          g = 255;
          b = vm.count*2.55;
          vm.color3 = 'rgba(255,255,255,'+(1-(100-vm.count)/33.3333)+')';
          vm.message = "";
          vm.foto = "";
        }else if(vm.count>=33.33){
          r = 255;
          g = Math.floor(vm.count*5.1);
          b = Math.floor(vm.count*2.55);
        }else{
          r = Math.floor(vm.count*7.65);
          g = Math.floor(vm.count*5.1);
          b = Math.floor(vm.count*2.55);
        }
        vm.color = 'rgb('+b+','+g+','+r+')';
        nav.color = vm.color;
      }
    }
})

