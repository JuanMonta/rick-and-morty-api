import { NgModule } from '@angular/core';
import { APOLLO_OPTIONS } from 'apollo-angular';
import { ApolloClientOptions, InMemoryCache } from '@apollo/client/core';
import { HttpLink } from 'apollo-angular/http';

// Nuestra única fuente de verdad para la API de GraphQL
const uri = 'https://rickandmortyapi.com/graphql';

// Función Factory para configurar el cliente de Apollo
export function createApollo(httpLink: HttpLink): ApolloClientOptions<any> {
  return {
    link: httpLink.create({ uri }),
    cache: new InMemoryCache(),
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


