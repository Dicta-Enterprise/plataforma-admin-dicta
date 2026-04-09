import { firstValueFrom } from 'rxjs';
import { DictaStateService } from '../helpers/dicta-state/dicta-state.service';
import { ParameterService } from '../helpers/parameters/parameter.service';

export function initParameters(
  parametersService: ParameterService,
  state: DictaStateService,
) {
  return async () => {
    try {
      const response = await firstValueFrom(
        parametersService.getAllParameters(),
      );

      Object.entries(response).forEach(([key, value]) => {
        state.set(key, value);
      });
    } catch {
      // state.set(ParameterNode.CATEGORIES, []);
      // state.set(ParameterNode.BRANDS, []);
    }
  };
}
