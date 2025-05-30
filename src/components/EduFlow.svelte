<script lang="ts">
    import {writable} from 'svelte/store';
    import {SvelteFlow, Background, type Node as XYNode, type Edge, Position} from '@xyflow/svelte';

    import '@xyflow/svelte/dist/style.css';

    const nodes = writable<XYNode[]>([
        {
            id: '1',
            position: {x: 100, y: 140},
            data: {
                label: 'Goethe-Gymnasium Bensheim'
            },
            selected: true,
            sourcePosition: Position.Right,
            targetPosition: Position.Left
        },
        {
            id: '2',
            position: {x: 300, y: 100},
            data: {
                label: 'h_da Darmstadt'
            },
            sourcePosition: Position.Right,
            targetPosition: Position.Left
        },
        {
            id: '2/c',
            position: {x: 300, y: 200},
            data: {
                label: 'SVA GmbH'
            },
            sourcePosition: Position.Right,
            targetPosition: Position.Left
        },
        {
            id: '3',
            position: {x: 500, y: 150},
            data: {label: 'Not unlocked yet...'},
            sourcePosition: Position.Right,
            targetPosition: Position.Left,
            class: "opacity-50"
        }
    ]);
    const edges = writable<Edge[]>([
            {
                id: '1-2',
                source: '1',
                target: '2',
                animated: true
            },
            {
                id: '1-2/c',
                source: '1',
                target: '2/c',
                animated: true
            },
            {
                id: '2-3',
                source: '2',
                target: '3',
            },
            {
                id: '2/c-3',
                source: '2/c',
                target: '3',
            }
        ]
    );
</script>

<main>
    <SvelteFlow {nodes} {edges} zoomOnScroll={false} autoPanOnConnect={false} autoPanOnNodeDrag={false}
                nodesConnectable={false} nodeOrigin={[0.5, 0.5]}>
        <Background bgColor="#f8fbf8"/>
        <!--        <Controls />-->
    </SvelteFlow>
</main>

<style>
    main {
        height: 300px;
        width: 100%;
    }
</style>