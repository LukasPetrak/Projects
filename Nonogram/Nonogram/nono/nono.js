
        // Po��te�n� hodnoty pro pole s nonogramem.
let Row_count = 5;  // Po��te�n� stav ��dk�.
let Clm_count = 5;  // Po��te�n� stav sloupc�.
let max_rc = 20;    // Maxim�ln� po�et ��dk� a sloupc�.
let min_rc = 5;    // Minim�ln� po�et ��dk� a sloupc�.
let space_nonopoint = "20px ";  // Rozte�e mezi body nonogramu.
let none_color = '#b6ff00';
let n_step = 0; // Volba pokra�ov�n� nebo konec

document.getElementById("result").style.display = "none";   // Skryje v�po�et nonogramu.
get_tabulku(Row_count * Clm_count); // Po��te�n� zobrazen�.
document.getElementById("area").innerHTML = area();

let mousebtn = 0;
// Mouse buttons.
document.addEventListener('mousedown', e => mousebtn = e.buttons);
document.addEventListener('mouseup', e => mousebtn = e.buttons);
// Keyboard keys.
document.addEventListener('keydown', e => console.log(e.key));
document.addEventListener('keydup', e => console.log(e.key));

function area() {
    return "Area: " + Row_count + " x " + Clm_count;
}

    // Smaz�n� nonogramu.
function cls() {
    for (let i = 1; i <= Row_count * Clm_count; i++) {
        document.getElementById(i).style.backgroundColor = none_color;
    }
    if (document.getElementById("rowLck").checked == false) {
        document.getElementById("m_row").innerHTML = "";
    }
    if (document.getElementById("clmLck").checked == false) {
        document.getElementById("m_clm").innerHTML = "";
    }
    document.getElementById("result").style.display = "none";
}

    // Celkov� reset do tov�ru.
function reset(stav) {
    if (stav == 1) {
        Row_count = 5;
        Clm_count = 5;
        calc_nono_board();
    }
    // Odstran�n� nono tvorba.
    const grid1 = document.getElementById("getNono");
    while (grid1.hasChildNodes()) {
        grid1.removeChild(grid1.firstChild);
    }

    // Odstran�n� nono v�po�et.
    const grid2 = document.getElementById("setNono");
    while (grid2.hasChildNodes()) {
        grid2.removeChild(grid2.firstChild);
    }

    document.getElementById("area").innerHTML = area();
    get_tabulku(Row_count * Clm_count);
    document.getElementById("m_row").innerHTML = "";
    document.getElementById("m_clm").innerHTML = "";
    document.getElementById("rowLck").checked = false;   // Odblokuj� se ��dky.
    document.getElementById("clmLck").checked = false;   // Odblokuj� se sloupce.
    document.getElementById("m_row").style.color = 'black'; // Nastaven� defaultn� barvy.
    document.getElementById("m_clm").style.color = 'black';

    document.getElementById("result").style.display = "none";
}

    // P�id�n� nebo ubr�n� ��dk�.
function rows() {
    if (document.getElementById("rUp").checked) { // �adky se budou p�id�vat.
        if (Row_count < max_rc) {
            Row_count += 1;
            if (document.getElementById("rLck").checked) { // Pom�r stran je uzam�en.
                if (Clm_count < max_rc) Clm_count += 1;
            }
        }
    } else {    // �adky se budou ub�rat.
        if (Row_count > min_rc) {
            Row_count -= 1;
            if (document.getElementById("rLck").checked) { // Pom�r stran je uzam�en.
                if (Clm_count > min_rc) Clm_count -= 1;
            }
        }
    }
    calc_nono_board();
    reset(0);
}

    // P�id�n� nebo ubr�n� sloupc�.
function clmns() {
    if (document.getElementById("rUp").checked) { // Sloupce se budou p�id�vat.
        if (Clm_count < max_rc) {
            Clm_count += 1;
            if (document.getElementById("rLck").checked) { // Pom�r stran je uzam�en.
                if (Row_count < max_rc) Row_count += 1;
            }
        }
    } else {
        if (Clm_count > min_rc) {
            Clm_count -= 1;
            if (document.getElementById("rLck").checked) { // Pom�r stran je uzam�en.
                if (Row_count > min_rc) Row_count -= 1;
            }
        }
    }
    calc_nono_board();
    reset(0);
}

    // P�id�v� ��dky, sloupce nebo oboj� do m��ky.
function calc_nono_board() {
    let board = space_nonopoint;
    for (let r = 1; r < Row_count; r++) {
        board += space_nonopoint;
    }
    // P��d�n� ��dk�.
    document.getElementById("getNono").style.gridTemplateRows = board;  // Tvorba nono.
    document.getElementById("setNono").style.gridTemplateRows = board;  // V�po�et nono.

    board = space_nonopoint;
    for (let r = 1; r < Clm_count; r++) {
        board += space_nonopoint;
    }
    // P�id�n� sloupc�.
    document.getElementById("getNono").style.gridTemplateColumns = board;   // Tvorba nono.
    document.getElementById("setNono").style.gridTemplateColumns = board;   // V�po�et nono.
}

    // Nastavuje atributy jednotliv�ch bod� a p�id�v� je do m��ky.
function get_tabulku(count_point) {
    for (let i = 1; i <= count_point; i++) {
        // Tvorba nonogramu.
        let Nono_point = document.createElement("div");
        Nono_point.id = i;
        Nono_point.className = "poku";
        Nono_point.setAttribute("onmousedown", "get_cell_clik(this)");
        Nono_point.setAttribute("onclick", "calk_data(this)");
        Nono_point.setAttribute("onmouseenter", "write_mouse(this)");
        document.getElementById("getNono").appendChild(Nono_point); // Do m��ky se p�id� bod nonogramu.


        // V�po�et nonogramu.
        Nono_point = document.createElement("div");
        Nono_point.id = "s" + i;
        Nono_point.className = "poku";
        document.getElementById("setNono").appendChild(Nono_point); // Do m��ky se p�id� bod nonogramu.
    }
}

    // Byl vybr�n jednotliv� bod m��ky.
function get_cell_clik(x) {
    if (x.style.backgroundColor == 'red') {
        x.style.backgroundColor = none_color;
        color_nono = none_color;
    } else {
        x.style.backgroundColor = 'red';
        color_nono = "red";
    }
}

 let color_nono = "red";
    // V�b�r bod� pohybem my�i.
function write_mouse(x) {
    if (mousebtn == 1) {
        x.style.backgroundColor = color_nono;
        calk_data(x);
    }
}

function calk_data(x) {
    let id_el = x.id;
    if (id_el <= Row_count * Clm_count) {
        let text_row = "[";
        for (let r = 0; r < Row_count; r++) {
            text_row += "(";
            let line_count = 0;
            for (let c = 1; c <= Clm_count; c++) {
                let point = r * Clm_count + c;
                if (document.getElementById(point).style.backgroundColor == "red") {
                    line_count += 1;
                } else {
                    if (line_count) {
                        text_row += line_count + ", ";
                        line_count = 0;
                    }
                }
            }
            if (line_count) {
                text_row += line_count + ", ";
                line_count = 0;
            }
            text_row += "), ";
        }
        text_row = text_row.substring(0, text_row.length - 2) + "]";
        if (document.getElementById("rowLck").checked == false) {
            document.getElementById("m_row").innerHTML = text_row;
        }
        let text_col = "[";
        for (let c = 1; c <= Clm_count; c++) {
            text_col += "(";
            line_count = 0;
            for (let r = 0; r < Row_count; r++) {
                //point = r * Row_count + c;
                point = Clm_count * r + c;
                if (document.getElementById(point).style.backgroundColor == "red") {
                    line_count += 1;
                } else {
                    if (line_count) {
                        text_col += line_count + ", ";
                        line_count = 0;
                    }
                }
            }
            if (line_count) {
                text_col += line_count + ", ";
                line_count = 0;
            }
            text_col += "), ";
        }
        text_col = text_col.substring(0, text_col.length - 2) + "]";
        if (document.getElementById("clmLck").checked == false) {
            document.getElementById("m_clm").innerHTML = text_col;
        }
    }
}

let seconds = 0;  
let m_seconds = 0;
let sec_counter = setInterval(time_of_run, 100);
let animation = 0;

function run_nono() {   // Solve.
    if (document.getElementById("m_row").innerHTML == "" || document.getElementById("m_clm").innerHTML == "") {
        //reset(0);
        document.getElementById("nadpis").style.color = "red";
        document.getElementById("nadpis").innerHTML = "The rows and columns field cannot be empty!";
        //setTimeout(cptSet(), 3000);
        return;
    }

    n_step = 0;
    calculation = true;
    document.getElementById("cpt1").innerHTML = "Please wait, the calculation is in progress. (It may take several hours!)";
    document.getElementById("choice").style = "pointer-events: none";   // Zak�z�ni interakce s u�ivatelem
    document.getElementById("setnono").style = "pointer-events: none";
    document.getElementById("option").style = "pointer-events: none";
    document.getElementById("section2").style = "pointer-events: none";
    document.getElementById("nextStep").style.visibility = "hidden";   // Zobrazen� tla��tek Again a End.

    if (document.getElementById("rowLck").checked || document.getElementById("clmLck").checked) {
        for (let i = 1; i <= Row_count * Clm_count; i++) {
            document.getElementById("s" + i).style.borderColor = 'rgba(255, 0, 0, 1)';
        }

    }

    document.getElementById("result").style.display = "block";  // Zobrazen� sekce s v�sledky. 

    // Vynuluj� se po��tadla.
    seconds = 0;   
    m_seconds = 0;
    // P�id� element s po��t�n�m sekund
    const element = document.getElementById("c_time");
    if (!element) {
        const cptime = document.createElement("h3");
        cptime.id = "c_time";
        cptime.innerText = "00:00:00";
        document.getElementById("result").insertBefore(cptime, document.getElementById("chng_nono"));
    } else {
        element.innerText = "00:00:00";
    }
    document.getElementById("chng_nono").style.visibility = "hidden";
    // Spust� animaci.
    animation = 1;
     // P�esune str�nku na konec
    document.body.scrollTop = document.body.scrollHeight;  
    document.documentElement.scrollTop = document.documentElement.scrollHeight;
}
function cptSet() {
    document.getElementById("nadpis").style.color = "green";
    document.getElementById("nadpis").innerHTML = "Mouse, draw a picture";
}

let calculation = false;
function time_of_run() {
    m_seconds += 1;
    if (m_seconds >= 10) {
        m_seconds = 0;
        seconds += 1;
        const miliS = seconds * 1000;
        const element = document.getElementById("c_time");
        if (element && calculation) {
            element.innerText = new Date(miliS).toISOString().slice(11, 19);
        }
    }
    if (animation) animate_nono();
}

    // Animace nonogramu.
let stepAni = 1;
function animate_nono() {
    for (let i = 1; i <= Row_count * Clm_count; i++) {
        if (i == stepAni) {
            document.getElementById("s" + i).style.backgroundColor = "red";
        } else {
            document.getElementById("s" + i).style.backgroundColor = none_color;
        }
    }
    stepAni += 1;
    if (stepAni > Row_count * Clm_count) stepAni = 1;
}

    // Spust� se po v�po�tu nonogramu a zobraz� v�sledky.
let numnono_max = 1;
let nono_pole;
function get_nono_solution() {
    animation = 0;
    calculation = false;
    /*const element = document.getElementById("c_time");
    if (element) element.remove();*/
    // Zobrazen� tla��tek Again a End.
    document.getElementById("nextStep").style.visibility ="visible";

    
    nono_pole = idata.split(";"); // Jednotliv� �e�en� nonogramu.  
    numnono_max = nono_pole.length;  // Po�et �e�en� nonogramu.

    if (numnono_max > 1) {
        document.getElementById("nononum").innerHTML = "1"
        document.getElementById("chng_nono").style.visibility = "visible";
    } else {
        document.getElementById("chng_nono").style.visibility = "hidden";
    }
    document.getElementById("cpt1").innerHTML = "Nonogram - calculated."; // Zobrazen� po�tu �e�en�.
    // document.getElementById("cpt1").innerHTML = "Nonogram - calculated: " + numnono_max + " solutions"; // Zobrazen� po�tu �e�en�.
    show_nono(1);   // Zobraz� se 1. �e�en�. 
}

function show_nono(nononumber) {
    for (let i = 1; i <= Row_count * Clm_count; i++) {
        if (nono_pole[nononumber - 1].charAt(i - 1) == "1") {
            document.getElementById("s" + i).style.backgroundColor = 'red';
        } else {
            document.getElementById("s" + i).style.backgroundColor = none_color;
        }
    }
}

function nono(choice_nono) {
    let numnono = Number(document.getElementById("nononum").innerHTML);
    if (choice_nono) {
        if (numnono < numnono_max) {
            numnono += 1;
        } else numnono = 1;
    } else {
        if (numnono > 1) {
            numnono -= 1;
        } else numnono = numnono_max;
    }
    document.getElementById("nononum").innerHTML = numnono;
    show_nono(numnono);

}

function get_data_from_var(type) {
    switch (type) {
        case '1':
            return idata;
        case '2':
            return n_step;
        default:
            return 0;
    }
}

let idata = 0;
function set_data_to_var(nono_data) {
    idata = nono_data;
    return nono_data;
}

function again() {
    document.getElementById("choice").style = "pointer-events: auto";   // Zp��stupn�n� ovl�dac�ch prvk�.
    document.getElementById("setnono").style = "pointer-events: auto";
    document.getElementById("option").style = "pointer-events: auto";
    document.getElementById("section2").style = "pointer-events: auto";
    // Defaultn� nastaven�.
    document.getElementById("rUp").checked = "checked";
    document.getElementById("rLck").checked = "checked";
    document.getElementById("rowLck").checked = false;   // Odblokuj� se ��dky.
    document.getElementById("clmLck").checked = false;   // Odblokuj� se sloupce.
    document.body.scrollTop = document.body.scrollTop;   // P�esune str�nku na za��tek.
    document.documentElement.scrollTop = document.documentElement.scrollTop;
    n_step = 2;
    reset(1)

}

function lockRC(getLock) {

    cptColour = 'black';
    if (getLock.checked) {
        cptColour = 'red';
    }

    cptCr = "m_row"
    if (getLock.id == "clmLck") {
        cptCr = "m_clm";
    }
    document.getElementById(cptCr).style.color = cptColour;    
}