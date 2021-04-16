function pipeline(context,middlewares,index){
    const next = middlewares[index];

    if(typeof next != 'function') return context.next;

    return () => {
        const nextPipeline = pipeline(context,middlewares, index+1)
        return next({...context,next:nextPipeline});
    }
}

export default pipeline;
