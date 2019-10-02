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
        for(var i = 0; i<atividades.length;++i){
            atividades[i]['tempo'] = parseFloat(document.getElementById('valor'+i).value);
            soma_tempo += atividades[i]['tempo'];
        }
        //localStorage['grafo'] = JSON.stringify(atividades);
        postos_de_trabalho = Math.ceil(soma_tempo/takt);
        melhor = {'eficiencia':-1,
                  'solucao':null
                };
        for(var j = 0;j<1000;j++){  
            lista_posto = []
            for(var i = 0; i<postos_de_trabalho;i++){
                lista_posto.push([]);
            }
            lista_a = JSON.parse(JSON.stringify(atividades));
            while(lista_a.length > 0){
                lista_b = ordena_lista(lista_sem_predecessores(lista_a));
                for(var i = 0; i<lista_b.length;i++){
                    disponiveis = lista_disponiveis(lista_b[i],lista_posto);
                    if(disponiveis.length == 0){
                        lista_posto.push([]);
                        disponiveis = lista_disponiveis(lista_b[i],lista_posto);
                    }
                    lista_posto[disponiveis[0]].push(JSON.parse(JSON.stringify(lista_b[i])));
                    lista_a = remove_element(get_index(lista_b[i],lista_a),lista_a);
                }
            }
            eficiencia = eff(lista_posto);
            if(eficiencia > melhor['eficiencia']){
                melhor['eficiencia'] = eficiencia;
                melhor['solucao'] = JSON.parse(JSON.stringify(lista_posto));
            }
        }
        var imgData = canvas.toDataURL();
        var pdf = new jsPDF();
        tabel = [];
        for(var i = 0;i<melhor['solucao'].length;i++){
            for(var j = 0;j<melhor['solucao'][i].length;j++){
                tabel.push([melhor['solucao'][i][j]['letter'],(i+1),melhor['solucao'][i][j]['tempo']]);
            }
        }
        pdf.addImage(imgData, 'JPEG', 0, 0,210,130);
        pdf.text(20, 160,'Eficiência : '+melhor['eficiencia']);
        pdf.addPage();
        pdf.autoTable({
            head: [['Elemento', 'Grupo', 'Valor']],
            body: tabel
        });
        pdf.save("solucao.pdf");
    }
    function eff(lista){
        soma = 0.0;
        for(var i = 0; i<lista.length;i++){
            soma += time_sum(lista[i]);
        }
        return soma/(takt*lista.length);
    }
    function ordena_lista(lista){
        retorno = []
        while(lista.length > 0){
            element = Math.round(Math.random()*(lista.length-1))
            retorno.push(JSON.parse(JSON.stringify(lista[element])));
            lista = remove_element(element,lista);
        }
        return retorno
    }
    function lista_sem_predecessores(lista){
        lista_b = []
        for(var i = 0; i<lista.length;i++){
            if(lista[i]['predecessores'].length < 1){
                lista_b.push(JSON.parse(JSON.stringify(lista[i])));
            }
        }
        return lista_b;
    }
    function get_index(el,lista){
        for(var i = 0;i<lista.length;i++){
            if(el['x'] == lista[i]['x'] && el['y'] == lista[i]['y'] && el['tempo'] == lista[i]['tempo']){
                return i;
            }

        }
    }
    function time_sum(lista){
        var soma = 0.0;
        for(var i = 0;i<lista.length;i++){
            soma += lista[i]['tempo'];
        }
        return soma;
    }
    function lista_disponiveis(el,lista){
        lista_retorno = [];
        for(var i = 0;i<lista.length;i++){
            if((time_sum(lista[i])+el['tempo'])<takt){
                if(i == (lista.length - 1)){
                    lista_retorno.push(i);
                }else if(lista[i+1].length == 0){
                    lista_retorno.push(i);
                }
            }
        }
        return lista_retorno;
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
            Newcell2.innerHTML = '{'+atividades[i]['predecessores'].toString()+"}"; 
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
        atividades = reset_letters(atividades);
        draw_elements(atividades);
    }
    function reset_letters(lista){
        for(var i = 0; i<lista.length; i++){
            lista[i]['letter'] = String.fromCharCode(start+i);
        }
        return lista
    }
    function draw_elements(lista){
        for(var i = 0;i<lista.length;i++){
            drawStuff(lista[i]);
        }
    }
    function remove_element(id,lista){
        aux = JSON.parse(JSON.stringify(lista))
        aux = aux.filter(function(value, index, arr){return index != id;});
        for(var i = 0; i<aux.length;i++){
            for(var j = 0;j<aux[i]['predecessores'].length;j++){
                if(aux[i]['predecessores'][j] === id){
                    aux[i]['predecessores'].splice(j, 1);
                    j--;
                }else if(aux[i]['predecessores'][j] > id){
                    aux[i]['predecessores'][j] -= 1;
                }
            }
        }
        return aux
    }
    function del(event){
    	for(var i = 0; i<atividades.length;i++){
    		if(colision(atividades[i],aux) === 1){
				index = i;
				break;
    		}
    	}
        atividades = remove_element(index,atividades);
    	reset();
    }
    function connect(el){
    	if(atividades.indexOf(el)!=selecionadas){
    		el['predecessores'].push(selecionadas);
    	}
    }
    function paint(event){
    	context.beginPath();
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
    			if(atividades[i]['color'] == 'rgb(48,47,47)' && col == 1){
    				if(selecionadas != null){
    					connect(atividades[i]);
    					atividades[selecionadas]['color'] = 'rgb(48,47,47)';
    					atividades[i]['color'] = 'rgb(48,47,47)';
    					selecionadas = null;
    				}else{
    					atividades[i]['color'] = 'rgb(106,209,144)';
    					selecionadas = i;
    				}
    			}else if(col == 1){
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
    	}if(count == 0){
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
        context.font = "60px Arial";
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