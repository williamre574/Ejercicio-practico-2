import { Component, OnInit } from '@angular/core';
import { single } from './data';
import { Chart, ChartType } from 'chart.js/auto';
import { FormControl } from '@angular/forms';
import { GetCEOService } from '../app/services/get-ceo.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  selectedOption: string = '';
  selectedOption2: string = '';
  selectedOption3: string = '';
  selectedDate1: Date;
  selectedDate2: Date;
  options: any;
  options2: any;
  dataGrafic: any;
  visible: boolean;
  constructor(public service: GetCEOService) {}

  ngOnInit(): void {
    // const chart2 = new Chart('chart2', {
    //   type: 'line',
    //   data,
    // });

    this.service.getInfo().subscribe({
      next: (value: any) => {
        console.log(value);
        this.options = value
          .filter(
            (x, index, self) =>
              self.findIndex((y) => y.Country === x.Country) === index
          )
          .map((x) => x.Country);

        // Obtén los años únicos
        this.options2 = value
          .filter(
            (x, index, self) =>
              self.findIndex((y) => y.Year === x.Year) === index
          )
          .map((x) => x.Year);

        console.log(this.options);
      },
      error: (e) => {
        console.log(e);
      },
    });
  }
  chart: Chart | undefined;
  chart2: Chart | undefined;
  chart3: any | Chart | undefined;
  ngAfterViewChecked() {
    if (this.visible && !this.chart) {
      // Crear la gráfica solo cuando 'visible' es true y la gráfica aún no se ha creado
      // Obtén etiquetas y valores de dataGrafic
      const labels = Object.keys(this.dataGrafic[0]); // Utiliza las claves del primer elemento como etiquetas
     // Suma los valores de cada elemento y agrégalos a un solo arreglo
     const summedValues = labels.map((label) => {
      return this.dataGrafic.reduce((sum, element) => sum + element[label], 0);
    });
      console.log('000',summedValues)
      const data = {
        labels: labels,
        datasets: [
          {
            label: 'Emisiones de CO2',
            data: summedValues,
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
          },
        ],
      };

      const valuesArray = Object.values(this.dataGrafic[0]);
      console.log(valuesArray);
      const data2 = {
        labels: ['Red', 'Blue', 'Yellow', 'Black', 'Pink', 'Lightblue'],

        datasets: [
          {
            label: 'Emisiones de CO2',
            data: summedValues, // Valores para cada categoría
            backgroundColor: [
              'red',
              'blue',
              'yellow',
              'black',
              'pink',
              'Lightblue',
            ],
            hoverOffset: 4,
          },
        ],
      };
      console.log(data);
      console.log(data2);

      this.chart = new Chart('chart', {
        type: 'bar' as ChartType,
        data,
      });
      this.chart3 = new Chart('chart3', {
        type: 'pie' as ChartType,
        data: data2,
      });

      this.chart2 = new Chart('chart2', {
        type: 'line',
        data,
      });
    }
  }

  filtro(country: any, year: any, dateEnd: any) {
    console.log('eee', year);
    console.log(country);
    console.log(dateEnd);
    this.service.getInfo().subscribe({
      next: (r) => {
        console.log(r);
        const dataArray = Object.keys(r).map((key) => r[key]);
        const filteredDataByCountry = dataArray.filter((element: any) => {
          return element.Country === country;
        });

        console.log(filteredDataByCountry);

        const filteredDataByYearRange = [];

        for (let currentYear = year; currentYear <= dateEnd; currentYear++) {
          const elementForYear = filteredDataByCountry.find((element: any) => {
            const yearNumber = parseInt(element.Year, 10);
            return yearNumber === currentYear;
          });

          if (elementForYear) {
            filteredDataByYearRange.push(elementForYear);
          }
        }
        console.log(filteredDataByYearRange);
        if (filteredDataByYearRange.length > 0) {
          const newData = filteredDataByYearRange.map((element: any) => {
            return {
              GasFlaring: element['Gas Flaring'],
              GasFuel: element['Gas Fuel'],
              LiquidFuel: element['Liquid Fuel'],
              PerCapita: element['Per Capita'],
              SolidFuel: element['Solid Fuel'],
              Total: element.Total,
            };
          });
          console.log('dataaaaaaaaaaaaaa', newData);
          this.dataGrafic = newData;
          console.log('dat', this.dataGrafic);
          this.visible = true;
        }
        if (this.chart) {
          this.chart.destroy();
          this.chart = undefined;
          this.chart2.destroy();
          this.chart2 = undefined;
          this.chart3.destroy();
          this.chart3 = undefined;
        }
      },
      error: (e) => {
        console.log(e);
      },
    });
  }
}
