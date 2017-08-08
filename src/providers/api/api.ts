import { Apollo, ApolloQueryObservable } from 'apollo-angular';
import gql from 'graphql-tag';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { Business } from '../../shared/models';

const nearbyBusiness = gql`
  query nearbyBusinesses($lat: Float!, $long: Float!, $distance: Float!) {
    nearbyBusinesses(lat: $lat, long: $long, distance: $distance){
      id
      name
      coordinates
    }
  }
`;

const signinUser = gql`
  mutation generateToken($email: String!, $password: String!) {
    signinUser(
      email: {
        email: $email,
        password: $password
      }
    ) {
      token
    }
  }
`;


@Injectable()
export class ApiProvider {

  constructor(private apollo: Apollo) {

  }

  getNearbyBusiness(lat, long, distance) : ApolloQueryObservable<any> {
    return this.apollo.watchQuery({
      query     : nearbyBusiness,
      variables : { lat, long, distance }
    });
  }

  signinUser() : any {
    console.log('signinUser ...', this.apollo)
    return this.apollo.mutate({
      mutation  : signinUser,
      variables : {email: 'marge.simpson@gmail.coms', password: 'test123',}
    });
  }
}
