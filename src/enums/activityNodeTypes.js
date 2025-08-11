// here will be an array of objects with all activity node types and exported as a constant
export const ACTIVITY_NODE_TYPES = [
    {
      type: 'start',
      label: 'Start',
      svg: '<circle cx="12" cy="12" r="8" fill="black"/>'
    },
    {
      type: 'action',
      label: 'Action',
      svg:
        '<rect x="4" y="6" width="16" height="12" rx="4" fill="#ffffff" stroke="#333"/>'
    },
    {
      type: 'decision',
      label: 'Decision',
      svg:
        '<polygon points="12,4 20,12 12,20 4,12" fill="#fff" stroke="#333"/>'
    },
    {
      type: 'merge',
      label: 'Merge',
      svg:
        '<polygon points="12,4 20,12 12,20 4,12" fill="#fff" stroke="#333"/>'
    },
    {
      type: 'fork',
      label: 'Fork',
      svg:
        // bar + three tiny ticks BELOW
        '<rect x="3" y="9" width="18" height="6" rx="1" fill="#333"/>' +
        '<path d="M6 16v4 M12 16v4 M18 16v4" ' +
        'stroke="#333" stroke-width="2" vector-effect="non-scaling-stroke"/>'
    },
    {
      type: 'join',
      label: 'Join',
      svg:
        // bar + three tiny ticks ABOVE
        '<rect x="3" y="9" width="18" height="6" rx="1" fill="#333"/>' +
        '<path d="M6 8v-4 M12 8v-4 M18 8v-4" ' +
        'stroke="#333" stroke-width="2" vector-effect="non-scaling-stroke"/>'
    },
    {
      type: 'send',
      label: 'Send',
      svg:
        '<polygon points="2,4 17,4 22,12 17,20 2,20" fill="#fff" stroke="#333" stroke-width="2" vector-effect="non-scaling-stroke" stroke-linejoin="miter" />'
    },
    {
      type: 'accept',
      label: 'Accept',
      svg:
        '<polygon points="22,4 22,20 2,20 8,12 2,4" fill="#fff" stroke="#333" stroke-width="2" vector-effect="non-scaling-stroke" stroke-linejoin="miter" />'
    },
    {
      type: 'end',
      label: 'End',
      svg:
        '<circle cx="12" cy="12" r="10" stroke="#333" stroke-width="2" fill="none"/><circle cx="12" cy="12" r="6" fill="black"/>'
    }
];