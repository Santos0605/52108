Lo primero que tenemos que hacer es obviamente abrir la carpeta analizador en Visual Studio Code 
![image](https://github.com/user-attachments/assets/8cceb1a0-4276-41d9-a91b-bf6937056ada) 
despues de eso copiamos el contenido de alguno de los 4 ejemplos en el input.txt y guardamos los cambios, se puede hacer manualmente o con (Ctrl + S).(Ej1.txt, Ej2.txt, Ej3.txt, Ej4.txt) 
![image](https://github.com/user-attachments/assets/b6022d22-6cda-456e-aca5-fddf960f05e1) ![image](https://github.com/user-attachments/assets/b3218f40-aeed-4213-a111-26fd7ec2ea9b)
Los ejemplos 1 y 2 son los correspondientes a los ejemplos que si tienen una correcta ejecucion, y los 3 y 4 son los que tienen errores lexicos o sintacticos.
Luego apretamos la tecla "F5" esta nos va a mostrar el parse tree que genera el propio ANTLR en una ventana aparte 
![image](https://github.com/user-attachments/assets/ae9f9dcd-aa6a-4ee6-a4eb-a91e67e56c81)
, ademas va estar en la debug consol los tokens y el parse tree.
Luego abrimos la terminal tocando click derecho debajo de los archivos de nuestro proyecto y tocamos Open in Integrated Terminal 
![image](https://github.com/user-attachments/assets/f83a46ae-5040-49c9-b8f3-e2429feb7dcb)
, y en dicha terminal escribimos node index.js lo que ejecutaria el codigo y mostraria: 
![image](https://github.com/user-attachments/assets/2f8e6e58-758f-456a-9ed8-df088d41f0b0)
, y eso seria la ejecucion de uno de los ejemplos que si toma.
Para otro ejemplo copiamos el contrenido de otro de los archivos Ej.txt y en el input.txt, guardamos los cambios, y realizamos los mismos pasos: 
![image](https://github.com/user-attachments/assets/892baa34-85f6-4f3f-bbb5-3f9b1ab913a8) ![image](https://github.com/user-attachments/assets/01686eb8-9a67-43cb-8460-4c207eae0398)
, en este caso al apretar F5 nos va a mostrar el error que detecta el parser en el arbol generado por ANTRL 
![image](https://github.com/user-attachments/assets/62275f57-9f56-482f-ac4a-c88f82a3fd84)
, luego colocamos el node index.js en la terminal y nos aparece 
![image](https://github.com/user-attachments/assets/5ec9ce1c-a08c-45f6-be2e-951c7e6e6f48), codigo el cual detecta el mismo error que se marca en el parse tree.
