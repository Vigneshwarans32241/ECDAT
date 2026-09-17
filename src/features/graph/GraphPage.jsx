import { useState, useCallback, useMemo } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import PageHeader from '../../components/layout/PageHeader';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { mockGraphData } from '../../mock/graph-data';
import { Network } from 'lucide-react';

export default function GraphPage() {
  const [nodes, , onNodesChange] = useNodesState(mockGraphData.nodes);
  const [edges, , onEdgesChange] = useEdgesState(mockGraphData.edges);
  const [selectedNode, setSelectedNode] = useState(null);
  const [filterTier, setFilterTier] = useState('all');

  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
  }, []);

  const filteredNodes = useMemo(() => {
    if (filterTier === 'all') return nodes;
    return nodes.filter(n => String(n.data.tier) === filterTier);
  }, [nodes, filterTier]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: 'calc(100vh - 120px)' }}>
      <PageHeader
        title="Cryptographic Architecture Dependency Graph"
        subtitle="Explore 4-tier lineage: Business Domains ? Applications ? Crypto Providers ? Cryptographic Assets"
        actions={
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: '#64748b' }}>Filter Tier:</span>
            <select
              value={filterTier}
              onChange={(e) => setFilterTier(e.target.value)}
              style={{ padding: '6px 10px', fontSize: '13px', borderRadius: '6px', border: '1px solid #d1d5db' }}
            >
              <option value="all">All Tiers (Full Perimeter)</option>
              <option value="1">Tier 1: Business Domains</option>
              <option value="2">Tier 2: Applications</option>
              <option value="3">Tier 3: Crypto Libraries</option>
              <option value="4">Tier 4: Crypto Assets</option>
            </select>
          </div>
        }
      />

      <div style={{ display: 'flex', gap: '20px', flex: 1, minHeight: 0 }}>
        {/* React Flow Canvas Container */}
        <div style={{ flex: 1, background: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', overflow: 'hidden', position: 'relative' }}>
          <ReactFlow
            nodes={filteredNodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            fitView
          >
            <Controls />
            <MiniMap nodeColor={(n) => n.data?.color || '#3b82f6'} />
            <Background variant="dots" gap={16} size={1} />
          </ReactFlow>

          {/* Canvas Tier Legend */}
          <div style={{ position: 'absolute', bottom: '16px', left: '16px', background: 'rgba(255, 255, 255, 0.92)', padding: '10px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '11px', display: 'flex', gap: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '8px', height: '8px', background: '#1e40af', borderRadius: '2px' }} />
              <span>Tier 1: Domains</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '8px', height: '8px', background: '#3b82f6', borderRadius: '2px' }} />
              <span>Tier 2: Apps</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '8px', height: '8px', background: '#64748b', borderRadius: '2px' }} />
              <span>Tier 3: Libraries</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '8px', height: '8px', background: '#dc2626', borderRadius: '2px' }} />
              <span>Tier 4: Assets (Red = Vulnerable)</span>
            </div>
          </div>
        </div>

        {/* Node Details Inspection Side Panel */}
        <div style={{ width: '340px', display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto' }}>
          {selectedNode ? (
            <Card title={selectedNode.data?.label || 'Node Details'} subtitle={`Tier ${selectedNode.data?.tier} Entity`}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13px' }}>
                <div>
                  <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Entity Type</span>
                  <div style={{ fontWeight: 600, color: '#0f172a', textTransform: 'capitalize' }}>
                    {selectedNode.type}
                  </div>
                </div>

                {selectedNode.data?.quantum && (
                  <div>
                    <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Quantum Status</span>
                    <div style={{ marginTop: '2px' }}>
                      <Badge variant={selectedNode.data.quantum === 'vulnerable' ? 'high' : selectedNode.data.quantum === 'pqc_native' ? 'pqc' : 'low'}>
                        {selectedNode.data.quantum?.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                )}

                {selectedNode.data?.risk && (
                  <div>
                    <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Risk Band</span>
                    <div style={{ marginTop: '2px' }}>
                      <Badge variant={selectedNode.data.risk}>{selectedNode.data.risk}</Badge>
                    </div>
                  </div>
                )}

                <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '11px', fontWeight: 600, color: '#334155', textTransform: 'uppercase' }}>Blast Radius & Lineage</div>
                  <p style={{ fontSize: '12px', color: '#475569', margin: '4px 0 0 0', lineHeight: 1.5 }}>
                    Modifying or migrating this component directly impacts linked callers across both upstream ingress routers and downstream ledger data stores.
                  </p>
                </div>
              </div>
            </Card>
          ) : (
            <Card title="Entity Inspector" subtitle="Select any node to inspect lineage">
              <div style={{ textAlign: 'center', padding: '32px 16px', color: '#94a3b8' }}>
                <Network size={36} style={{ margin: '0 auto 12px auto', opacity: 0.6 }} />
                <p style={{ fontSize: '13px', margin: 0 }}>Click on any node in the graph canvas to inspect its blast radius and dependencies.</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
