<<<<<<< Updated upstream
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
    foto:'',
    text:''
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
          vm.foto = "<img width=250 height=250 src='https://scontent.fnat2-1.fna.fbcdn.net/v/t1.0-9/44932380_1897647920325959_2992166237515022336_n.jpg?_nc_cat=110&_nc_oc=AQmu05IWNPLqGKH72oPYmXmjAyhZX32L8dhcWz0AI1bu6JatLeqHnd3oiq3mMcp2QlFnzm6rqic5x_6OJLFZ5AYj&_nc_ht=scontent.fnat2-1.fna&oh=46c7356bfd7febdc001253e5d91ebe59&oe=5DE15726'>"
          vm.message = "<h1>&nbspSobre Mim</h1> "+
                      " <p>&nbspSou aluno do 8&ordm per&iacuteodo de  Engenharia de Produ&ccedil&atildeo pela Universidade Federal do Rio Grande do Norte,<br>"+
                      " &nbspcom interesses em pesquisa operacional, otimiza&ccedil&atildeo e aprendizado de m&aacutequina. Fa&ccedilo pesquisa no HEII  <br> "+
                      "&nbsp(Healthcare, Engineering and Industrial Innovation). Tenho experi&ecircncia em programa&ccedil&atildeo nas linguagens <br>&nbspPython, Matlab, C, C++, Java e Javascript.<br><br>"+
                      "<a class='btn' href='https://www.github.com/varellalexandre'>Meu Reposit&oacuterio</a><a class='btn' href='https://www.linkedin.com/in/alexandre-varella-93b6b8140/e'>Meu linkedin</a>";  
          vm.text = '';
        }else if(vm.count >=66.66){
          r = 255;
          g = 255;
          b = vm.count*2.55;
          vm.color3 = 'rgba(255,255,255,'+(1-(100-vm.count)/33.3333)+')';
          vm.message = "";
          vm.foto = "";
          vm.text = 'Programação';
        }else if(vm.count>=33.33){
          r = 255;
          g = Math.floor(vm.count*5.1);
          b = Math.floor(vm.count*2.55);
          vm.text = 'Otimização';
        }else{
          r = Math.floor(vm.count*7.65);
          g = Math.floor(vm.count*5.1);
          b = Math.floor(vm.count*2.55);
          vm.text = 'Alexandre Varella';

        }
        vm.color = 'rgb('+b+','+g+','+r+')';
        nav.color = vm.color;
      }
    }
})

=======
(function() {
    var proj = document.getElementById('proj');
    var sobre = document.getElementById('sobremim');
    proj.addEventListener("mousedown",change_page,false);
    sobre.addEventListener("mousedown",change_back,false);
    function change_page(event){
    	var canva = document.getElementById('calculo');
	    var page1 = document.getElementById('page1');
	    var body = document.getElementById('body');
	    body.style.height='100vh';
        canva.style.display = 'table';
        page1.style.display = 'none';
    }
    function change_back(event){
    	var canva = document.getElementById('calculo');
	    var page1 = document.getElementById('page1');
	    var comsoal = document.getElementById('comsoal');
	    var botao = document.getElementById('calcular_comsoal');
	    var body = document.getElementById('body');
	    botao.style.display='none';
	    body.style.height='150vh';
	    comsoal.style.display = 'none';
        canva.style.display = 'none';
        page1.style.display = 'block';
    }
})();
>>>>>>> Stashed changes
