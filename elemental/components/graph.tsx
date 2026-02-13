"use client";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend, layouts, elements, ChartOptions, TooltipItem } from "chart.js";
import annotationPlugin from 'chartjs-plugin-annotation';
import { Bar } from "react-chartjs-2";


export default function ExampleChart({ total = 370000000, paid = 50000000, initialQuota = 120000000 }: { total?: number, paid?: number, initialQuota?: number }) {
    ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, annotationPlugin);

    const valorTotal = total;
    const cuotaInicial = initialQuota;
    const cuotasPagadas = paid;

    const data = {
        labels: ["Valor apartamento"],
        datasets: [

            {
                label: "cuotas pagadas",
                data: [cuotasPagadas],
                backgroundColor: "#374151", // Gris oscuro (parte inferior)
                borderRadius: { bottomLeft: 4, bottomRight: 4 }
            },

            {
                label: "Cuota inicial",
                data: [cuotaInicial - cuotasPagadas],
                backgroundColor: "#6b7280", // Gris medio
            },

            {
                label: "Valor total",
                data: [valorTotal - cuotaInicial],
                backgroundColor: "#10b981", // Verde (parte superior)
                borderRadius: { topLeft: 4, topRight: 4 }
            }

        ],
    };

    const options: ChartOptions<'bar'> = {
        responsive: true,
        datasets: {
            bar: {
                // barThickness: 80,          // Ancho fijo en píxeles
                // maxBarThickness: 100,   // Ancho máximo (opcional)
                barPercentage: 0.4,     // Porcentaje del espacio disponible (0.1-1.0)
                // categoryPercentage: 0.2,   // Espacio entre categorías (0.1-1.0)
                // offset: false              // Alinea al borde izquierdo

            }
        },
        scales: {
            x: {
                stacked: true,
                display: true,
                // offset: false,             // No centrar las barras
                grid: {
                    offset: true          // Alinear grid al borde
                },

            },
            y: {
                stacked: true,
                display: true, // Ocultar etiquetas del eje Y
                min: 0,
                max: total,
                ticks: {
                    callback: function (value: string | number) {
                        const numValue = typeof value === 'string' ? parseFloat(value) : value;
                        return '$' + (numValue / 1000000) + ' M'; // Formato en millones
                    }
                }
            },
            y1: {
                type: 'linear' as const,
                display: true,
                position: 'right' as const, // Lado derecho
                min: 0,
                max: 100,
                ticks: {
                    callback: function (value: string | number) {
                        const numValue = typeof value === 'string' ? parseFloat(value) : value;
                        return numValue + '%'; // Mostrar porcentajes
                    }
                },
                grid: {
                    drawOnChartArea: true, // No dibujar líneas para evitar superposición
                },
            }
        },
        plugins: {
            legend: {
                display: true // Ocultar leyenda
            },
            tooltip: {
                enabled: true,
                callbacks: {
                    label: function (tooltipItem: TooltipItem<'bar'>) {
                        const datasetLabel = tooltipItem.dataset.label;

                        if (datasetLabel === "cuotas pagadas") {
                            return `Cuotas pagadas: $${(cuotasPagadas / 1000000).toFixed(1)}M`;
                        }
                        if (datasetLabel === "Cuota inicial") {
                            return `Cuota inicial: $${(cuotaInicial / 1000000).toFixed(1)}M`;
                        }
                        if (datasetLabel === "Valor total") {
                            return `Valor total: $${(valorTotal / 1000000).toFixed(1)}M`;
                        }

                        return tooltipItem.label;
                    },
                    afterBody: function () {
                        return [
                            ``,
                            `Resumen:`,
                            `• Valor total: $${(valorTotal / 1000000).toFixed(1)}M`,
                            `• Cuota inicial: $${(cuotaInicial / 1000000).toFixed(1)}M`,
                            `• Cuotas pagadas: $${(cuotasPagadas / 1000000).toFixed(1)}M`
                        ];
                    }
                }
            },
            annotation: {
                annotations: {
                    cuotasPagadasLine: {
                        type: 'line' as const,
                        yMin: cuotasPagadas,
                        yMax: cuotasPagadas,
                        borderColor: '#374151',
                        borderWidth: 1,
                        borderDash: [5, 5],
                        label: {
                            display: true,
                            content: 'Cuotas Pagadas',
                            position: 'end' as const,
                            backgroundColor: '#374151',
                            color: 'white',
                            padding: {
                                top: 4, bottom: 4, left: 10, right: 10
                            }
                        }
                    },
                    cuotaInicialLine: {
                        type: 'line' as const,
                        yMin: cuotaInicial,
                        yMax: cuotaInicial,
                        borderColor: '#6b7280',
                        borderWidth: 2,
                        borderDash: [5, 5],
                        label: {
                            display: true,
                            content: 'Cuota Inicial',
                            position: 'end' as const,
                            backgroundColor: '#6b7280',
                            color: 'white',
                            padding: {
                                top: 4, bottom: 4, left: 10, right: 10
                            }
                        }
                    },
                    valorTotalLine: {
                        type: 'line' as const,
                        yMin: valorTotal,
                        yMax: valorTotal,
                        borderColor: '#10b981',
                        borderWidth: 2,
                        borderDash: [5, 5],
                        label: {
                            display: true,
                            content: 'Valor Total',
                            position: 'end' as const,
                            backgroundColor: '#10b981',
                            color: 'white',
                            padding: {
                                top: 4, bottom: 4, left: 10, right: 10
                            }
                        }
                    }
                }
            }
        },
        maintainAspectRatio: false
    }; return (
        <div className="w-full h-96 max-w-2xl">
            <Bar data={data} options={options} />
        </div>
    );
}