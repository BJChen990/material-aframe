import shallowEqual from 'shallowequal';

export default class FunctionUtil {
    static contextShallowCompare(instance, nextProps, nextState, nextContext) {
        return (
            !shallowEqual(instance.props, nextProps) ||
            !shallowEqual(instance.state, nextState) ||
            !shallowEqual(instance.context, nextContext)
        );
    }

    static listify(objectOrList) {
        if (!objectOrList) {
            return [];
        }

        if (!Array.isArray(objectOrList)) {
            return [objectOrList];
        }

        return objectOrList;
    }
}
