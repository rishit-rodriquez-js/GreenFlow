"""
GreenFlow ETL - LangGraph Workflow Graph Assembly.
Defines the linear pipeline: START -> Extract -> Transform -> Load -> END.
"""

import os
import sys

# Ensure backend directory is in sys.path for Render & local execution
backend_dir = os.path.dirname(os.path.abspath(__file__))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from langgraph.graph import StateGraph, START, END
from nodes import PipelineState, extract_node, transform_node, load_node


def build_etl_graph():
    """
    Constructs and compiles the GreenFlow LangGraph ETL workflow graph.
    """
    workflow = StateGraph(PipelineState)

    # Add single-responsibility nodes
    workflow.add_node("extract", extract_node)
    workflow.add_node("transform", transform_node)
    workflow.add_node("load", load_node)

    # Define linear execution flow
    workflow.add_edge(START, "extract")
    workflow.add_edge("extract", "transform")
    workflow.add_edge("transform", "load")
    workflow.add_edge("load", END)

    # Compile executable graph
    app = workflow.compile()
    return app


# Singleton instance of compiled ETL workflow
etl_pipeline = build_etl_graph()
