import type { PageLoad } from './$types';

export const load: PageLoad = ({ url }) => {
	const code = url.searchParams.get('code');
	return {
		code
	};
};
