#!/usr/bin/env python3
# -*- coding: utf-8 -*-


def enlazar(orig, links, dicc, post, finales):
    # Abrimos los ficheros
    with open(orig, 'r', encoding='utf-8') as f, open(links, 'w', encoding='utf-8') as f2:
        # Cargamos todas las líneas del fichero origen en ls
        ls = f.readlines()
        # Recorremos todas las líneas
        for linea in ls:
            # Nos aseguramos que sea un párrafo
            if linea.find("<p>") != -1:
                # Inicializamos la palabra que estamos encontrando
                mi_pal = ""
                link = False
                i = 0
                # Recorremos toda la línea para ver qué palabras encontramos
                while (i < len(linea)):
                    letra = linea[i]
                    # Cuando encontramos < sabemos que empieza un link y por tanto no acumulamos palabra.
                    if letra == "<":
                        link = False
                        # En este caso el inicio del tag termina una palabra de interés y creamos link
                        if mi_pal != "":
                            mi_pal = "<a target=\"_blank\" href=\"" + dicc + mi_pal + post + "\">" +  mi_pal + "</a>"
                            f2.write(mi_pal)
                        mi_pal = ""
                        f2.write(letra)
                    elif letra == "᾿":
                        sig = siguiente_letra(linea, i + 1, finales)
                        pal_bus = pal_apostrofe(mi_pal, sig)
                        pal_orig = pal_original(mi_pal, sig)
                        mi_pal = "<a target=\"_blank\" href=\"" + dicc + pal_bus + post + "\">" +  pal_orig + "</a>"
                        f2.write(mi_pal)
                        mi_pal = ""
                        f2.write(letra)
                    # En caso de encontrar un paréntesis de inicio simplemente lo saltamos.
                    elif letra == "(":
                        mi_pal = ""
                    # Si la letra está en la lista de posibles finales de palabra creamos un link
                    elif letra in finales:
                        if mi_pal != "":
                            mi_pal = "<a target=\"_blank\" href=\"" + dicc + mi_pal + post + "\">" +  mi_pal + "</a>"
                            f2.write(mi_pal)
                        mi_pal = ""
                        f2.write(letra)
                    # Si estamos en mitad de una palabra continuamos copiando letra a letra
                    elif link:
                        mi_pal += letra
                    # Fin de tag, podemos empezar a copiar de nuevo.
                    elif letra == ">":
                        link = True
                        f2.write(letra)
                    # En otro caso simplemente escribimos la letra en el fichero sin modificar
                    else:
                        f2.write(letra)
                    i = i + 1
            # Si no es un párrafo (tiene meta-información) no lo modificamos
            else:
                f2.write(linea)

# Función que busca la siguiente letra cuando encontramos un ' en griego
def siguiente_letra(linea, i, finales):
    encontrada = False
    letra = ""
    while ((i < len(linea)) and not encontrada):
        sig = linea[i]
        if not (sig in finales):
            letra = sig
            encontrada = True
        i = i + 1
    return letra

def pal_apostrofe(pal, sig):
    res = sig
    if (pal != ""):
        if (pal == "Μετ"):
            res = "μετά"
        else:
            if (sig == "α"):
                sig = "ά"
            res = pal + sig
    elif (sig == "Σ"):
        res = "᾿Σ"
    return res

def pal_original(pal, sig):
    res = ""
    if (pal == "") and (sig == "Σ"):
        res = "᾿Σ"
    else:
        res = pal + "᾿"
    return res

# Uso
finales = [" ", ",", ".", "·", ")", ";", "\n", "?"]
enlazar("griego.txt", "griego_links.txt", "http://logeion.uchicago.edu/index.html#", "", finales)
# enlazar("latin.txt", "latin_links.txt", "http://www.perseus.tufts.edu/hopper/morph?l=", "&la=la", finales)

# http://logeion.uchicago.edu/index.html#παρ᾿