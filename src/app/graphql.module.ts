import { NgModule } from '@angular/core';
import { ApolloClientOptions, InMemoryCache, NormalizedCacheObject } from '@apollo/client/core';
import { APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { environment } from 'src/environments/environment';

// Función Factory para configurar el cliente de Apollo
export function createApollo(httpLink: HttpLink): ApolloClientOptions<NormalizedCacheObject> {
  return {
    link: httpLink.create({
      uri: environment.graphqlUrl
    }),
    cache: new InMemoryCache({
      // Aquí a futuro se podrán agregar typePolicies para paginación local
    }),
    // Política de Caché por Defecto
    /* defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-and-network', // Excelente para vistas reactivas
        errorPolicy: 'all',
      },
      query: {
        fetchPolicy: 'network-only', // Asegura datos frescos en llamadas únicas
        errorPolicy: 'all',
      }
    } */
  };
}

@NgModule({
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink], // Inyección de dependencias clásica para la Factory
    },
  ],
})
export class GraphQLModule { }


