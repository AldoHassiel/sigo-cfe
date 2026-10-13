import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

export default function ContenedorTabs() {
  return (
    <Tabs defaultValue="Modulos">
      <TabsList>
        <TabsTrigger value="Modulos">Modulos</TabsTrigger>
        <TabsTrigger value="Sellos">Sello</TabsTrigger>
        <TabsTrigger value="Medidores">Medidores</TabsTrigger>
        <TabsTrigger value="Mapas">Mapas</TabsTrigger>
        <TabsTrigger value="HorasExtras">HorasExtras</TabsTrigger>
      </TabsList>
      
      <TabsContent>
        
      </TabsContent>
    </Tabs>
  );
}
