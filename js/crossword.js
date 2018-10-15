// Copyright (C) 2013 by Henry Kroll
/* Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License. */
"use strict";
function decodeURL(){
    var ret, ret = {};
    function q2obj(url){
        var qfrag,
            qArr = url.split('&'),
            i =-1;
        while(++i<qArr.length) {
            qfrag = qArr[i].split('=');
            ret[qfrag[0]] = decodeURIComponent(qfrag[1].replace(/\+/g, '%20'));
        }
    }
    var scripts = document.getElementsByTagName('script');
    var myScript = scripts[ scripts.length - 1 ];
    var queryString = myScript.src.replace(/^[^\?]+\??/,'');
    if(queryString) q2obj(queryString);
    if(location.search) q2obj(location.search.slice(1));
    return ret;
}
function bookmarkIt(url){
if(typeof url === "undefined")
    var url = document.location.href;
if (window.sidebar&&window.sidebar.addPanel)
    window.sidebar.addPanel(document.title,window.location.href,'');
else if(window.external && ('AddFavorite' in window.external)) { // IE Favorite
                window.external.AddFavorite(location.href,document.title); 
} else if(window.opera && window.print) { // Opera Hotlist
    this.title=document.title;
    return true;
} else { // webkit - safari/chrome
    alert('Press ' + (navigator.userAgent.toLowerCase().indexOf('mac') != - 1 ? 'Command/Cmd' : 'CTRL') + ' + D to bookmark this page.');
}
}
var acrossword = new (function(id){
    var self=this;
    this.postWord = function(dir,ind,word){
        var e = document.getElementById("wyrd"+ind);
        var p = e.parentNode, c;
        word = word.trim();
        for(var i=0;i<p.childNodes.length;i++){
            if(p.childNodes[i] === e) c = i;
        }
        for(var i=0;i<word.length;i++){
            e.childNodes[0].textContent=word[i];
            if(dir==="across"){
                if(e.nextSibling) e=e.nextSibling;
                else break;
            } else {
                if(p.nextSibling){
                    p = p.nextSibling;
                    e = p.childNodes[c];
                } else break;              
            }
        }
    };
    this.showAnswers = function(){
        for(var i = 0;i<100;i++){
            if(across[i]) this.postWord("across",i,across[i]);
            if(down[i]) this.postWord("down",i,down[i]);
        }
    };
    function crosswordInit(){
        var crossword="";
        for(var i=0;i<max;i++){
            for(j=0;j<max;j++){
                crossword+=bc;
            } crossword +="\n";
        }
        a=crossword.split("\n");
        for(var i=0;i<a.length;i++){
            a[i]=a[i].split('');
            b[i]=a[i].slice(0);
        }
    }
    function crosswordBuild(){
        function doInsert(r,c,dr,dc,word){
            if (r<0 || c<0) return false;
            var or=r,oc=c;
            // trial run
            for(var i=0;i<word.length;i++){
                if(a[r][c] !== bc && a[r][c] !== word[i]) return false;
               r+=dr, c+=dc;
            } r=or,c=oc;
            // do it
            for(var i=0;i<word.length;i++){
                a[r][c] = word[i];
                if(!i){ // put index numbers in grid
                    if(dr){ // build down list
                        if(b[r][c]===bc || !b[r][c]){
                            b[r][c]=downInd.toString();
                            down[downInd] = word;
                            downInd+=2;
                        } else {
                            down[b[r][c]] = word;
                        }
                    } else { // build across list
                        if(b[r][c]===bc || !b[r][c]){
                            b[r][c]=acrossInd.toString();
                            across[acrossInd] = word;
                            acrossInd+=2;
                        } else {
                            across[b[r][c]] = word;
                        }
                    }
                } else if(b[r][c]===bc) b[r][c] = "";
                if(i==word.length-1){
                    b[r][c] = dr? b[r][c]+"b":b[r][c]+"r";
                }
                r+=dr, c+=dc;
            }
            if(oc < left) left = oc;
            if(or < top)  top  = or;
            if(oc >= right)  right  = oc+1;
            if(or >= bottom) bottom = or+1;
            if(c > right)  right = c;
            if(r > bottom) bottom = r;
            return true;
        }
        function placeWord(word){
            var row = 3, col = 5;
            if(!word) return;
            for(var i=0;i<max;i++){
                if(a[i]!==bc)
                for(var l=0;l<word.length;l++){
                    if((j = a[i].indexOf(word[l])) > -1){
                        if(doInsert(i,j-l, 0,1, word)) return;
                        if(doInsert(i-l,j, 1,0, word)) return;
                    }
                }
            } // fail: place anywhere
            while(!doInsert(row, col, 1,0, word)){
                if(doInsert(row, col, 0,1, word)) return;
                col ++; if(col > max){ col = 0, row++; }
            }
        }
        var n = 0, word, hint;
        while(typeof self.id["word"+n] !== "undefined"){
            var word = self.id["word"+n].trim();
            placeWord(word);
            n++;
        }
        return;
    }
    function getHint(word){
        for(var i=0;i<max;i++){
            if(typeof self.id["word"+i] !== "undefined" && self.id["word"+i].trim()==word){
                return self.id["hint"+i].trim();
            }
        }
    }
    var a=[], b=[], max=99, left=max, right=0, top=max, bottom=0;
    var across=[], down=[], acrossInd=1, downInd=2, bc="#";
    //~ default values in case no parameters were passed
    var style=document.getElementById("crosswordStyle");
    if(!style){
        // create style element if we ain't got it
        var css = '',
            head = document.getElementsByTagName('head')[0],
            style = document.createElement('style'),
            pstyle = document.createElement('style');
            style.id = "crosswordStyle";
            pstyle.id = "crosswordPStyle";
            //~ style.media = "screen";
            pstyle.media = "print";
        style.type = 'text/css';
        if (style.styleSheet){
          style.styleSheet.cssText = css;
        } else {
          style.appendChild(document.createTextNode(css));
          pstyle.appendChild(document.createTextNode(css));
        }
        head.appendChild(style);
        head.appendChild(pstyle);
    }
    pstyle.innerHTML="\
body {visibility:hidden;}\
input,br,p{display:none;}\
.printcw {text-align:left;visibility:visible;}\
table {-webkit-print-color-adjust: exact;}\
.blk {border-collapse:collapse;border:0}\
    ";
    style.innerHTML="\
.crossword{margin-left:0;border:1px solid black;border-collapse:collapse;}\
[contenteditable=\"true\"]:active,\
[contenteditable=\"true\"]:focus{\
    border:none;\
    outline:none;\
}\
table {empty-cells: show; position:relative;}\
.wht{\
    position:relative;border:1px solid black;font-size:2em;\
    line-height:1em;height:1em;width:0.8em;text-align:center;\
    padding:0.1em 0 0 0.1em;border-color:#444;}\
.blk{background-color:#444;border-color:#444;}\
.bgtxt {\
    font-size:0.4em;\
    position: absolute;\
    top: -0.8em;\
    left: -1em;\
    bottom: 0;\
    right: 0;\
    overflow: hidden;\
    -webkit-user-select: none;\
    -khtml-user-select: none;\
    -moz-user-select: none;\
    -o-user-select: none;\
    user-select: none;\
}";
    if(typeof id === "undefined"){
        self.id={};
        return;
    } else self.id=id;
    crosswordInit();
    crosswordBuild();
    document.write("<div class='printcw' style='text-align:left'>");
    document.write("<table id='crossword' class='crossword'><tbody>");
    for(var i=top;i<bottom;i++){
        document.write("<tr>");
        for(var j=left;j<right;j++){
            document.write("<td");
            if(b[i][j]===bc){
                document.write(' class="blk">&nbsp;</td>');
            } else {
                var ind = parseInt(b[i][j]);
                document.write(' class="wht"');
                if(ind) document.write(' id="wyrd'+ind+'"');
                if(b[i][j].search(/[br]/)>-1) { document.write(' style="');
                    if(b[i][j].indexOf('b')>-1 && b[i+1][j]!==bc)
                        document.write('border-bottom:4px solid #444;');
                    if(b[i][j].indexOf('r')>-1 && b[i][j+1]!==bc)
                        document.write('border-right: 4px solid #444;');
                    document.write('"');
                }
                document.write('>&nbsp;');
                if(ind)
                    document.write('<div class="bgtxt">'+ind+"</div>");
                document.write("</td>");
            }
        } document.write("</tr>");
    } document.write("</tbody></table>");
    if(id["answer"]==="on"){
        document.write("<input type='button' value='Show answers' onclick='acrossword.showAnswers();'>");
    }
    if(id["bookmark"]==="on"){
        document.write(' <input type="button" value="Bookmark" onclick="bookmarkIt();return false;" />');
    }
    if(id["print"]==="on"){
        document.write(' <input type="button" value="Print" onclick="window.print();return false;" />');
    }
    document.write("<br><div style='float:left;margin-right:1em;'><h3>Across: </h3> ");
    var hint;
    for(var i=0;i<across.length;i++){
        if(typeof across[i] !== "undefined"){
            document.write("<label>" + i + ". " + getHint(across[i]) + " <br> ");
            document.write("<input type='text' onblur='acrossword.postWord(\"across\","+i+",this.value)'/></label><br/>");
        }
    }
    document.write("</div><div style='float:left;'><h3>Down: </h3> ");
    for(var i=0;i<down.length;i++){
        if(typeof down[i] !== "undefined"){
            document.write("<label>" + i + ". " + getHint(down[i]) + " </br> ");
            document.write("<input type='text' onblur='acrossword.postWord(\"down\","+i+",this.value)'/></label><br/>");
        }
    }document.write("</div></div>");

})(decodeURL());