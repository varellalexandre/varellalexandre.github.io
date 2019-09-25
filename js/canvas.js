(function() {
    var canvas = document.getElementById('canvas');
    var raio = 25;
    var selecionadas = null;
    var start = 65;
    context = canvas.getContext('2d');
    atividades = [];
    last_mouse_click = {}
    // resize the canvas to fill browser window dynamically
    window.addEventListener('resize', resizeCanvas, false);
    canvas.addEventListener("mousedown", paint, false);
    canvas.addEventListener("mousemove",drag,false);
    canvas.addEventListener("mouseup",desmarca,false);
    canvas.addEventListener("dblclick",del,false);
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
    		'moving':false
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