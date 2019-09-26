(function() {
    var canvas = document.getElementById('canvas');
    var horas = document.getElementById('horas');
    var pecas = document.getElementById('pecas');
    var botao_calculo = document.getElementById('calcular');
    var botao_comsoal = document.getElementById('calcular_comsoal');
    var postos = null;
    var raio = 25;
    var selecionadas = null;
    var start = 65;
    var takt = null;
    var dialog = document.getElementById('dialog');
    context = canvas.getContext('2d');
    atividades = JSON.parse(localStorage.getItem('grafo'));
    if(atividades == null){
        atividades = [];
    }
    last_mouse_click = {}
    // resize the canvas to fill browser window dynamically
    window.addEventListener('resize', resizeCanvas, false);
    canvas.addEventListener("mousedown", paint, false);
    canvas.addEventListener("mousemove",drag,false);
    canvas.addEventListener("mouseup",desmarca,false);
    canvas.addEventListener("dblclick",del,false);
    botao_calculo.addEventListener("mousedown",calcula_valor,false);
    botao_comsoal.addEventListener("mousedown",calcula_comsoal,false);
    function calcula_comsoal(){
        soma_tempo = 0;
        lista_posto = []
        lista_a = []
        lista_b = []
        for(var i = 0; i<atividades.length;++i){
            atividades[i]['tempo'] = parseFloat(document.getElementById('valor'+i).value);
            lista_a.push({
                'id':i,
                'predecessores':atividades[i]['predecessores'].length
            });
            if(atividades[i]['predecessores'].length == 0){
                lista_b.push({
                    'id':i
                })
            }
            soma_tempo += atividades[i]['tempo'];
        }
        localStorage['grafo'] = JSON.stringify(atividades);
        postos_de_trabalho = Math.ceil(soma_tempo/takt);
        for(var i = 0; i<postos_de_trabalho;i++){
            lista_posto.push([]);
        }
        while(lista_a.length > 0){
            for(var i = 0; i<lista_b.length;i++){
                disponiveis = lista_disponiveis(lista_posto);
                id_lista = Math.round(Math.random()*(disponiveis.length-1));
                //calcular os predecessores
            }
        }
    }
    function lista_disponiveis(lista){
        lista_retorno = [];
        for(var i = 0;i<lista.length;i++){
            if(soma_tempo(lista[i])<takt){
                lista_retorno.push(i)
            }
        }
        return lista_retorno;

    }
    function soma_tempo(lista){
        var soma = 0;
        for(var i;i<lista.length;i++){
            soma += lista[i]['tempo'];
        }
        return soma;
    }
    function remove_rows(table){
        for(var i = table.rows.length ; i>1 ;i--){
            table.deleteRow(i-1);
        }
    }
    function calcula_valor(event){
        takt = horas.value/pecas.value;
        table = document.getElementById('comsoal');
        remove_rows(table);
        for(var i = 0;i<atividades.length;i++){
            var  nrow = table.insertRow(table.rows.length); 
            var Newcell1 = nrow.insertCell(0); 
            var Newcell2 = nrow.insertCell(1); 
            var Newcell3 = nrow.insertCell(2);
            Newcell1.innerHTML = atividades[i]['letter']; 
            Newcell2.innerHTML = 'Elementos '+atividades[i]['predecessores'].toString(); 
            Newcell3.innerHTML = "<input class='mdl-textfield__input' type='number' value="+atividades[i]['tempo']+" step=0.01 id='valor"+i+"'/>";
        }
        table.style.display = 'table';
        botao_comsoal.style.display = 'inline'
    }
    function nearestPoint(A,B){
    	x = A['x'] + A['r']*((B['x']-A['x'])/Math.sqrt(Math.pow((B['x']-A['x']),2)+Math.pow((B['y']-A['y']),2)));
    	y = A['y'] + A['r']*((B['y']-A['y'])/Math.sqrt(Math.pow((B['x']-A['x']),2)+Math.pow((B['y']-A['y']),2)));
    	return {'x':x,'y':y};
    }
    function matrix(){
    	matriz = []
    	for(var i=0;i<atividades.length;i++){
    		matriz.push([]);
    		for(var j=0;j<atividades.length;j++){
    			if(atividades[i]['predecessores'].indexOf(j) === -1){
    				matriz[matriz.length-1].push(0);
    			}else{
    				matriz[matriz.length-1].push(1);
    			}
    		}
    	}
    	return matriz
    }
    function desmarca(event){
    	aux = {
    		'predecessores':[],
    		'letter':String.fromCharCode(start+atividades.length),
    		'y':last_mouse_click['y'],
    		'x':last_mouse_click['x'],
    		'r':raio*cssScaleX,
    		'color':'rgb(48,47,47)'
    	}
    	for(var i = 0; i<atividades.length;i++){
    		if(colision(atividades[i],aux) === 1 && atividades[i]['moving']){
    			atividades[i]['moving'] = false;
    			atividades[i]['color'] = 'rgb(48,47,47)';
    			break;
    		}
    	}
    }
    function drag(event){
    	aux = {
    		'predecessores':[],
    		'letter':String.fromCharCode(start+atividades.length),
    		'y':last_mouse_click['y'],
    		'x':last_mouse_click['x'],
    		'r':raio*cssScaleX,
    		'color':'rgb(48,47,47)'
    	}
    	for(var i = 0; i<atividades.length;i++){
    		if(colision(atividades[i],aux) === 1 && atividades[i]['moving']){
    			atividades[i]['x'] = aux['x'];
    			atividades[i]['y'] = aux['y'];
				reset();
    			break;
    		}
    	}
        last_mouse_click['y'] = (event.y-canvas.getBoundingClientRect().top)*cssScaleY;
        last_mouse_click['x'] = (event.x-canvas.offsetLeft)*cssScaleX;
    	return;
    }
    function reset(){
    	context.clearRect(0, 0, canvas.width, canvas.height);
    	for(var i = 0; i<atividades.length; i++){
    		atividades[i]['letter'] = String.fromCharCode(start+i);
    		drawStuff(atividades[i]);
    	}
    }
    function del(event){
    	for(var i = 0; i<atividades.length;i++){
    		if(colision(atividades[i],aux) === 1){
				atividades = atividades.filter(function(value, index, arr){return index != i;});
				index = i;
				break;
    		}
    	}
    	for(var i = 0; i<atividades.length;i++){
    		for(var j = 0;j<atividades[i]['predecessores'].length;j++){
    			if(atividades[i]['predecessores'][j] === index){
    				atividades[i]['predecessores'].splice(j, 1);
    				j--;
    			}else if(atividades[i]['predecessores'][j] > index){
    				atividades[i]['predecessores'][j] -= 1;
    			}
    		}
    	}
    	reset();
    }
    function connect(el){
    	if(atividades.indexOf(el)!=selecionadas){
    		el['predecessores'].push(selecionadas);
    	}
    }
    function paint(event){
    	context.beginPath();
    	context.font = "60px Arial";
        last_mouse_click['y'] = (event.y-canvas.getBoundingClientRect().top)*cssScaleY;
        last_mouse_click['x'] = (event.x-canvas.offsetLeft)*cssScaleX;
    	aux = {
    		'predecessores':[],
    		'letter':String.fromCharCode(start+atividades.length),
    		'y':last_mouse_click['y'],
    		'x':last_mouse_click['x'],
    		'r':raio*cssScaleX,
    		'color':'rgb(48,47,47)',
    		'moving':false,
            'tempo':null
    	}
    	count = 0;
    	for(var i = 0; i<atividades.length;i++){
    		col = colision(atividades[i],aux);
    		if(col != 0){
    			count += 1;
    			if(atividades[i]['color'] === 'rgb(48,47,47)' && col === 1){
    				if(selecionadas != null){
    					connect(atividades[i]);
    					atividades[selecionadas]['color'] = 'rgb(48,47,47)';
    					atividades[i]['color'] = 'rgb(48,47,47)';
    					selecionadas = null;
    				}else{
    					atividades[i]['color'] = 'rgb(87,30,27)';
    					selecionadas = i;
    				}
    			}else if(col === 1){
    				atividades[i]['moving'] = true;
    				if(selecionadas != null){
    					connect(atividades[i]);
    					atividades[selecionadas]['color'] = 'rgb(48,47,47)';
    					atividades[i]['color'] = 'rgb(48,47,47)';
    					selecionadas = null;
    				}
    			}
    			break;
    		}else{
    			continue;
    		}
    	}if(count === 0){
    		atividades.push(aux);
    	}
		reset();
    }
    function colision(A,B){
    	dist = Math.sqrt(Math.pow(A['x']-B['x'],2)+Math.pow(A['y']-B['y'],2))
    	draio = A['r']+B['r']
    	if(dist<=A['r']){
    		return 1;
    	}else if(dist <= draio){
    		return 2;
    	}
    	return 0;
    }
    function resizeCanvas() {
        canvas.width = 2.5*(window.innerWidth);
        canvas.height = 2.5*(window.innerHeight);
    	for(var i = 0; i<atividades.length; i++){
    		drawStuff(atividades[i]);
    	}
    }
    resizeCanvas();
    var cssScaleX = canvas.width / canvas.offsetWidth;  
	var cssScaleY = canvas.height / canvas.offsetHeight;
    function drawStuff(i) {
    	context.beginPath();
        context.lineWidth = 2;
    	context.strokeStyle = i['color']
    	context.strokeText(i['letter'], i['x']-16, i['y']+16);
			context.arc(i['x'],i['y'],i['r'],0,2*Math.PI);
			for(var j = 0;j<i['predecessores'].length;j++){
				np = nearestPoint(i,atividades[i['predecessores'][j]]);
				ni = nearestPoint(atividades[i['predecessores'][j]],i);
				context.arrow(ni['x'],ni['y'],np['x'],np['y'],[]);
			}
		context.stroke();
    }
})();