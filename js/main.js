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
