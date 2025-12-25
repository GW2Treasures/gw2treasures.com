import { useEffect, type FC } from 'react';
import { useFedCM } from './fedcm-context';
import { useUserPromise } from '../User/use-user';
import { Scope } from '@gw2me/client';

export const SilentFedCM: FC = () => {
  const triggerFedCM = useFedCM();
  const user = useUserPromise();

  useEffect(() => {
    user.then((user) => {
      if(user) {
        return;
      }

      // always attempt silent login if the user is not logged in
      console.debug('[SilentFedCM] Attempting silent login');
      triggerFedCM({
        returnTo: window.location.pathname + window.location.search,
        mediation: 'silent',
        mode: 'passive',
        // we don't actually need to request any scopes here, because the silent login only works if the user has already authorized the app before
        // and all previously granted scopes are always included when using FedCM (https://gw2.me/dev/docs/fed-cm)
        scopes: [Scope.Identify],
      });
    });
  });

  return null;
};
