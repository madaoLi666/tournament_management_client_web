/**
 * 传入value，如果有错误，返回一个string；否则返回一个null 
*/

export function judgeNull(value: any):string {
    if (value === null) {
        return 'value is null';
    }
    return null;
}

export function judgeUndefined(value: any):string {
    if (value === undefined) {
        return 'value is undefined';
    }
    return null;
}

export function judgeKeyValues(key: any, value: any):string {
    if (!(key in value)) {
        return 'no key';
    }
    return null;
}
