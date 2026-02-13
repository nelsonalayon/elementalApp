"use client";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend, layouts, elements } from "chart.js";
import annotationPlugin from 'chartjs-plugin-annotation';
import { Bar } from "react-chartjs-2";




export default function ExampleChart({users}: {users?: Array<{name: string, amount: number}>}) {
    
    ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, annotationPlugin);

const data = {
    labels: users ? users.map(user => user.name) : ["Patricia", "Camilo", "Nelson", "Cecilia"], // Etiquetas separadas
    datasets: [

        {
            label: "dinero aportado por persona",
            data: users ? users.map(user => user.amount) : [3000000, 3500000, 2000000, 4000000],
            backgroundColor: ["#10b981", "#6b7280", "#ef4444", "#f59e0b"] // Colores diferentes

        }

        
    ]
};

const options = {
    responsive: true,
    datasets: {
        bar: {
            barPercentage: 0.4,
        }
    },
    plugins: {
        legend: {
            onclick: undefined,   // Desactiva el clic
            labels: {
                boxWidth: 0,      // Elimina el cuadradito de color
                // boxHeight: 0,  // También puedes usar esto
            }
            // O para ocultarlo completamente:
            // display: false     
        }
    },
    scales: {
        x: {
            
            display: true,
            grid: {
                offset: true
            },
        },
        y: {
              
            display: true,
            beginAtZero: true,
        }
    },  
};
    return <Bar data={data} options={options} />;
}   

