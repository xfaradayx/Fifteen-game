
let app = new (function Desk () {
    this.params = null;
    this.arrToRender = null;

    this.render = function() {
        let left = 0;
        let top = 0;
        let arrChunk = this.arrToRender;

        this.checkWin(arrChunk, (this.params.w * this.params.h)-1);
        document.body.innerHTML = '';
        
        let div = document.createElement('div');
        div.style.width = this.params.wc + 'px';
        div.style.position = "absolute";
        div.style.height = this.params.hc +  'px';
        div.style.border = '1px solid black';
        div.style.lineHeight = `${this.params.hc}px`;
        div.style.textAlign = 'center';

        for (let i = 0; i < arrChunk.length; i++) {
            for (let j = 0; j < arrChunk[i].length; j++) {
                div.style.left = left + 'px';
                div.style.top = top + 'px';
                arrChunk[i][j] === 0 ? div.style.color = 'white' : div.style.color = '';//div.style.color = 'white';
                div.innerText = arrChunk[i][j];
                div.dataset.pos = new Array(i, j);

                try { div.dataset.top = arrChunk[i-1][j] } catch{}
                try { div.dataset.bottom = arrChunk[i+1][j] } catch{}
                try { div.dataset.left = arrChunk[i][j-1] } catch{}
                try { div.dataset.right = arrChunk[i][j+1] } catch{}
    
    
                document.body.append(div.cloneNode(true));
        
                if (j == this.params.w-1) {
                    left = 0;
                    top += this.params.hc;
                } else {
                    left += this.params.wc;
                }
            }
        }
    }

    this.randomArr = function() {
        let arr = [];
    
        for (let i = 0; i < this.params.w * this.params.h; i++) {
            arr.push(i);
        }
    
        let arrRand = arr.sort(function(a,b) {
            return Math.random() - 0.5;
        })
    
        let q = 0;
    
        this.arrToRender = arrRand.reduce((a, b, i)=>{	
            
            if (i % this.params.w == 0 && i !== 0 ) {
                a.push([]);
                a[q+1].push(b);
                q++;
            } else {
                a[q].push(b);
            }
    
            return a;
        }, [[]] );
    }

    this.desk = function (w, h, wc=100, hc=100) {
        this.params = {
            w: w,
            h: h,
            wc: wc,
            hc: hc,
        }
        
        document.body.style.width = w * wc + w*2 + 'px';
        document.body.style.height = h * hc+ w*2 + 'px';
    
        this.randomArr();   
        this.render();
        
        let self = this;
        document.body.onclick = function(e) {
    
            if (e.target.nodeName != 'DIV') return;
            let t = e.target.dataset;
            let side = null;
            let coords = null;
            
            for (let key in t) {
                if (key == 'pos') continue; 
                if (t[key] == '0')
                    side = key;
            }
            
            if (side) {
                coords = t.pos;
    
                switch(side) {
                    case 'left': coords = new Array(+coords[0], +coords[2]-1);
                    break;
                    case 'right': coords = new Array(+coords[0], +coords[2]+1);
                    break;
                    case 'bottom': coords = new Array(+coords[0]+1, +coords[2]);
                    break;
                    case 'top': coords = new Array(+coords[0]-1, +coords[2]);
                    break; 
                }
        
                self.replaceCells(t.pos, coords, self.arrToRender, side);
            }
        }
    }

    this.replaceCells = function (from, to, arr, side) {

        let fromX = from[0];
        let fromY = from[2];
        let toX = to[0];
        let toY = to[1];
    
        let fr = arr[fromX][fromY];
    
        if (side == 'left') {
            arr[fromX].splice(arr[fromX].indexOf(arr[fromX][fromY]), 1, 0);
            arr[toX].splice(arr[toX].indexOf(arr[toX][toY]), 1, fr);
        } else {
            arr[toX].splice(arr[toX].indexOf(arr[toX][toY]), 1, fr);
            arr[fromX].splice(arr[fromX].indexOf(arr[fromX][fromY]), 1, 0);
        }
    
        document.body.innerHTML = '';
    
        this.render();        
    }

    this.checkWin = function (arr, size) {
        const arrToWin = [1].reduce( (sum, a) => {
            while(a !== size+1) {
                sum.push(a);
                a++;
            }
            sum.push(0);
            return sum
            }, []).join();

        arr = arr.reduce( (cur, a) => {
            cur = cur.concat(a);
            return cur;
        }, []).join();
        console.log(arrToWin);
        console.log(arr);
        console.log(arrToWin === arr);        
        if (arrToWin === arr)  {
            alert ('Вы победили!');
            this.randomArr();   
            this.render();
        }
    }
})()

app.desk(2,2)
