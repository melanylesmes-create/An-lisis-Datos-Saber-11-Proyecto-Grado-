
from io import BytesIO
from datetime import datetime
from html import escape

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    HRFlowable,
    PageBreak,
    Image,
    KeepTogether,
)


# Colores provisionales de la plantilla institucional
AZUL = colors.HexColor("#17365D")
AZUL_CLARO = colors.HexColor("#EAF0F7")
AMARILLO = colors.HexColor("#F2C94C")
GRIS = colors.HexColor("#555555")
GRIS_CLARO = colors.HexColor("#D9E0E8")
BLANCO = colors.white


def generar_pdf(
    titulo="Informe de resultados Saber 11",
    subtitulo="Secretaría de Educación Municipal de Popayán",
    filtros=None,
    graficos=None,
    hallazgos=None,
    fuentes=None,
):
    buffer = BytesIO()

    documento = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=2 * cm,
        leftMargin=2 * cm,
        topMargin=2.1 * cm,
        bottomMargin=1.8 * cm,
        title=titulo,
        author="Secretaría de Educación Municipal de Popayán",
    )

    estilos = getSampleStyleSheet()

    estilos.add(ParagraphStyle(
        name="PortadaTitulo",
        parent=estilos["Title"],
        fontName="Helvetica-Bold",
        fontSize=23,
        leading=30,
        alignment=TA_CENTER,
        textColor=AZUL,
        spaceAfter=18,
    ))

    estilos.add(ParagraphStyle(
        name="PortadaSubtitulo",
        parent=estilos["Normal"],
        fontSize=12,
        leading=18,
        alignment=TA_CENTER,
        textColor=GRIS,
        spaceAfter=14,
    ))

    estilos.add(ParagraphStyle(
        name="Seccion",
        parent=estilos["Heading2"],
        fontName="Helvetica-Bold",
        fontSize=14,
        leading=18,
        textColor=AZUL,
        spaceBefore=12,
        spaceAfter=9,
        keepWithNext=True,
    ))

    estilos.add(ParagraphStyle(
        name="TextoInforme",
        parent=estilos["Normal"],
        fontSize=9.5,
        leading=14,
        textColor=GRIS,
        spaceAfter=6,
    ))

    estilos.add(ParagraphStyle(
        name="TituloGrafico",
        parent=estilos["Heading3"],
        fontName="Helvetica-Bold",
        fontSize=11,
        leading=15,
        textColor=AZUL,
        spaceBefore=10,
        spaceAfter=6,
        keepWithNext=True,
    ))

    contenido = []

    # -------------------------------------------------
    # 1. PORTADA
    # -------------------------------------------------

    contenido.append(Spacer(1, 2.2 * cm))

    contenido.append(HRFlowable(
        width="35%",
        thickness=5,
        color=AMARILLO,
        hAlign="CENTER",
        spaceAfter=25,
    ))

    contenido.append(Paragraph(
        escape(titulo),
        estilos["PortadaTitulo"],
    ))

    contenido.append(Paragraph(
        escape(subtitulo),
        estilos["PortadaSubtitulo"],
    ))

    contenido.append(Spacer(1, 0.7 * cm))

    contenido.append(HRFlowable(
        width="100%",
        thickness=1.5,
        color=AZUL,
        spaceBefore=8,
        spaceAfter=20,
    ))

    contenido.append(Paragraph(
        "INFORME DE ANÁLISIS DE RESULTADOS EDUCATIVOS",
        estilos["TextoInforme"],
    ))

    contenido.append(Spacer(1, 0.3 * cm))

    contenido.append(Paragraph(
        f"<b>Fecha de generación:</b> "
        f"{datetime.now().strftime('%d/%m/%Y %H:%M')}",
        estilos["TextoInforme"],
    ))

    if filtros:
        for nombre, valor in filtros.items():
            contenido.append(Paragraph(
                f"<b>{escape(str(nombre))}:</b> "
                f"{escape(str(valor))}",
                estilos["TextoInforme"],
            ))

    contenido.append(Spacer(1, 1.2 * cm))

    contenido.append(HRFlowable(
        width="100%",
        thickness=4,
        color=AMARILLO,
        spaceBefore=10,
    ))

    # Las páginas de contenido empiezan después de la portada.
    contenido.append(PageBreak())

    # -------------------------------------------------
    # 2. RESUMEN DEL ANÁLISIS
    # -------------------------------------------------

    contenido.append(Paragraph(
        "1. Resumen del análisis",
        estilos["Seccion"],
    ))

    contenido.append(Paragraph(
        "Este informe presenta los resultados educativos disponibles "
        "en la plataforma, de acuerdo con los criterios de consulta "
        "seleccionados.",
        estilos["TextoInforme"],
    ))

    contenido.append(Paragraph(
        "Los indicadores, comparaciones y hallazgos se incorporarán "
        "a partir de los datos y análisis proporcionados por el sistema.",
        estilos["TextoInforme"],
    ))

    # -------------------------------------------------
    # 3. GRÁFICOS Y RESULTADOS
    # -------------------------------------------------

    contenido.append(Paragraph(
        "2. Visualización de resultados",
        estilos["Seccion"],
    ))

    if graficos:
        for indice, grafico in enumerate(graficos, start=1):
            titulo_grafico = escape(
                str(grafico.get("titulo", f"Gráfico {indice}"))
            )

            elementos_grafico = [
                Paragraph(
                    titulo_grafico,
                    estilos["TituloGrafico"],
                )
            ]

            descripcion = grafico.get("descripcion", "")

            if descripcion:
                elementos_grafico.append(Paragraph(
                    escape(str(descripcion)),
                    estilos["TextoInforme"],
                ))

            # La imagen puede recibirse como ruta o archivo binario.
            imagen = grafico.get("imagen")

            if imagen:
                try:
                    imagen_pdf = Image(
                        imagen,
                        width=16.5 * cm,
                        height=9.5 * cm,
                        kind="proportional",
                    )

                    imagen_pdf.hAlign = "CENTER"
                    elementos_grafico.append(imagen_pdf)

                except Exception:
                    elementos_grafico.append(Paragraph(
                        "No fue posible incorporar la imagen de este "
                        "gráfico. Verifique el archivo proporcionado.",
                        estilos["TextoInforme"],
                    ))

            elementos_grafico.append(Spacer(1, 0.4 * cm))

            contenido.append(KeepTogether(elementos_grafico))

    else:
        contenido.append(Paragraph(
            "Los gráficos se mostrarán aquí cuando el archivo de "
            "análisis los proporcione. Esta sección está preparada "
            "para incorporar imágenes de resultados reales.",
            estilos["TextoInforme"],
        ))

    # -------------------------------------------------
    # 4. HALLAZGOS
    # -------------------------------------------------

    if hallazgos:
        contenido.append(Paragraph(
            "3. Hallazgos del análisis",
            estilos["Seccion"],
        ))

        for hallazgo in hallazgos:
            contenido.append(Paragraph(
                f"• {escape(str(hallazgo))}",
                estilos["TextoInforme"],
            ))

    # -------------------------------------------------
    # 5. FUENTES
    # -------------------------------------------------

    if fuentes:
        contenido.append(Paragraph(
            "Fuentes de información",
            estilos["Seccion"],
        ))

        for fuente in fuentes:
            contenido.append(Paragraph(
                f"• {escape(str(fuente))}",
                estilos["TextoInforme"],
            ))

    # -------------------------------------------------
    # ENCABEZADO Y PIE DE PÁGINA
    # -------------------------------------------------

    def dibujar_pagina(canvas, doc):
        canvas.saveState()

        ancho, alto = A4

        # Encabezado azul.
        canvas.setFillColor(AZUL)
        canvas.rect(
            0,
            alto - 1.15 * cm,
            ancho,
            1.15 * cm,
            fill=1,
            stroke=0,
        )

        # Línea amarilla de identidad visual.
        canvas.setFillColor(AMARILLO)
        canvas.rect(
            0,
            alto - 1.23 * cm,
            ancho,
            0.08 * cm,
            fill=1,
            stroke=0,
        )

        canvas.setFillColor(BLANCO)
        canvas.setFont("Helvetica-Bold", 9)

        canvas.drawString(
            2 * cm,
            alto - 0.72 * cm,
            "INFORME DE RESULTADOS SABER 11",
        )

        # Pie de página.
        canvas.setStrokeColor(GRIS_CLARO)
        canvas.setLineWidth(0.6)
        canvas.line(
            2 * cm,
            1.45 * cm,
            ancho - 2 * cm,
            1.45 * cm,
        )

        canvas.setFillColor(GRIS)
        canvas.setFont("Helvetica", 8)

        canvas.drawString(
            2 * cm,
            1.05 * cm,
            "Secretaría de Educación Municipal de Popayán",
        )

        canvas.drawRightString(
            ancho - 2 * cm,
            1.05 * cm,
            f"Página {doc.page}",
        )

        canvas.restoreState()

    documento.build(
        contenido,
        onFirstPage=dibujar_pagina,
        onLaterPages=dibujar_pagina,
    )

    buffer.seek(0)
    return buffer
